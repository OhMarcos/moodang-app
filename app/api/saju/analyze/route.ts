import { NextRequest, NextResponse } from "next/server";
import { ai, GEMINI_MODEL } from "@/lib/saju/gemini";
import { buildSajuSystemPrompt, buildSajuUserPrompt } from "@/lib/saju/saju-prompt";
import type { SajuInput, SajuReading } from "@/lib/saju/types";
import { validateSajuReading } from "@/lib/saju/validate";
import { calculateAllSystems } from "@/lib/saju/calculators";
import { validateEnv } from "@/lib/env";
import {
  checkIpRateLimitAsync,
  checkDailyCap,
  buildSajuCacheKey,
  getSajuCache,
  setSajuCache,
  hashIpSecure,
} from "@/lib/rate-limit";
import { saveReading } from "@/lib/database";

const RATE_LIMIT = 5; // per IP per window
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  try {
    // Fail fast if critical env vars are missing
    const env = validateEnv();
    if (!env.ok) {
      return NextResponse.json(
        { error: "서버 설정 오류입니다. 관리자에게 문의해주세요." },
        { status: 503 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    // Per-IP rate limit (persistent via Supabase)
    if (!(await checkIpRateLimitAsync(ip, RATE_LIMIT, RATE_WINDOW_MS))) {
      return NextResponse.json(
        { error: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요." },
        { status: 429 },
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "잘못된 요청 형식입니다." },
        { status: 400 },
      );
    }

    // Type coercion + required field check
    const birthYear = Number(body.birthYear);
    const birthMonth = Number(body.birthMonth);
    const birthDay = Number(body.birthDay);
    const birthHour = Number(body.birthHour ?? 12);
    const birthMinute = Number(body.birthMinute ?? 0);
    const gender = String(body.gender ?? "");
    const calendarType = String(body.calendarType ?? "solar");
    const name = String(body.name ?? "");
    const birthPlace = body.birthPlace ? String(body.birthPlace) : undefined;
    const currentConcern = body.currentConcern ? String(body.currentConcern) : undefined;

    if ([birthYear, birthMonth, birthDay].some(isNaN)) {
      return NextResponse.json(
        { error: "생년월일은 숫자여야 합니다." },
        { status: 400 },
      );
    }

    if (!gender) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 },
      );
    }

    // Birth date range validation
    const currentYear = new Date().getFullYear();
    if (birthYear < 1920 || birthYear > currentYear) {
      return NextResponse.json(
        { error: "생년은 1920년에서 올해 사이여야 합니다." },
        { status: 400 },
      );
    }
    if (birthMonth < 1 || birthMonth > 12) {
      return NextResponse.json(
        { error: "월은 1에서 12 사이여야 합니다." },
        { status: 400 },
      );
    }

    // Month-specific day validation (handles Feb 28/29, Apr 30, etc.)
    const maxDay = new Date(birthYear, birthMonth, 0).getDate();
    if (birthDay < 1 || birthDay > maxDay) {
      return NextResponse.json(
        { error: `${birthMonth}월은 최대 ${maxDay}일까지입니다.` },
        { status: 400 },
      );
    }

    // Hour/Minute validation (-1 = unknown for hour)
    if (isNaN(birthHour) || (birthHour !== -1 && (birthHour < 0 || birthHour > 23))) {
      return NextResponse.json(
        { error: "시간은 0-23 사이이거나 '모름'이어야 합니다." },
        { status: 400 },
      );
    }
    if (isNaN(birthMinute) || birthMinute < 0 || birthMinute > 59) {
      return NextResponse.json(
        { error: "분은 0-59 사이여야 합니다." },
        { status: 400 },
      );
    }

    if (!["male", "female"].includes(gender)) {
      return NextResponse.json(
        { error: "성별이 올바르지 않습니다." },
        { status: 400 },
      );
    }
    if (!["solar", "lunar"].includes(calendarType)) {
      return NextResponse.json(
        { error: "달력 유형이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const input: SajuInput = {
      name,
      birthYear,
      birthMonth,
      birthDay,
      birthHour: birthHour === -1 ? 12 : birthHour,
      birthMinute,
      gender: gender as "male" | "female",
      calendarType: calendarType as "solar" | "lunar",
      birthPlace,
      currentConcern,
    };

    const isBirthHourUnknown = birthHour === -1;

    // ─── Pre-compute all calculations deterministically (needed for cache + API paths) ───
    let preComputed;
    try {
      preComputed = await calculateAllSystems(input);
      if (isBirthHourUnknown) {
        preComputed = {
          ...preComputed,
          metadata: { ...preComputed.metadata, birthHourUnknown: true },
        };
      }
    } catch (calcError) {
      const msg = calcError instanceof Error ? calcError.message : String(calcError);
      console.error("Saju calculation engine error:", msg);
      return NextResponse.json(
        { error: "사주 계산 중 오류가 발생했습니다. 생년월일을 확인해주세요." },
        { status: 422 },
      );
    }

    // Extract full 만세력 data for frontend display (all algorithmic, no AI)
    const sajuChart = {
      pillars: preComputed.saju.pillars,
      tenGods: preComputed.saju.tenGods,
      twelveStages: preComputed.saju.twelveStages,
      sinsalsByPosition: preComputed.saju.sinsalsByPosition,
      dayMaster: preComputed.saju.dayMaster,
      strength: preComputed.saju.strength,
      yongShen: preComputed.saju.yongShen,
      elementBalance: preComputed.saju.elementBalance,
      majorLuck: preComputed.saju.majorLuck,
      yearlyLuck: preComputed.saju.yearlyLuck,
      relations: preComputed.saju.relations,
      sinsals: preComputed.saju.sinsals,
    };
    // Backward compat aliases
    const rawPillars = sajuChart.pillars;
    const strength = { levelKr: sajuChart.strength.levelKr, score: sajuChart.strength.score };
    const yongShen = { primary: sajuChart.yongShen.primary, secondary: sajuChart.yongShen.secondary ?? null };

    // ─── Check cache first (same birth data → same reading) ───
    const cacheKey = buildSajuCacheKey(input);
    const cachedResult = getSajuCache(cacheKey);

    if (cachedResult) {
      // Cache hit — no API call, no daily cap consumed
      const reading: SajuReading = JSON.parse(cachedResult);
      return NextResponse.json({ reading, cached: true, rawPillars, strength, yongShen, sajuChart });
    }

    // ─── Cache miss → check daily cap then call API ───
    const { allowed: dailyAllowed } = checkDailyCap();
    if (!dailyAllowed) {
      return NextResponse.json(
        { error: "오늘의 분석 횟수가 마감되었습니다. 내일 다시 시도해주세요!" },
        { status: 429 },
      );
    }

    const systemPrompt = buildSajuSystemPrompt();
    const userPrompt = buildSajuUserPrompt(input, preComputed);

    // Retry loop: Gemini may occasionally return invalid JSON
    const MAX_RETRIES = 2;
    let lastError = "";

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
          },
        ],
        config: {
          systemInstruction: systemPrompt,
          temperature: attempt === 0 ? 0.6 : 0.4, // lower temp on retry
          maxOutputTokens: 24576,
          responseMimeType: "application/json",
        },
      });

      const text = response.text ?? "";

      if (!text) {
        lastError = "empty_response";
        console.warn(`[saju] Empty response on attempt ${attempt + 1}`);
        continue;
      }

      let jsonStr = text;
      const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch?.[1]) {
        jsonStr = codeBlockMatch[1];
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(jsonStr.trim());
      } catch (parseError) {
        lastError = "json_parse";
        console.warn(`[saju] JSON parse failed on attempt ${attempt + 1}:`, text.substring(0, 300));
        continue;
      }

      // Runtime validation — prevent frontend crashes from malformed AI responses
      const validation = validateSajuReading(parsed, preComputed);
      if (!validation.ok) {
        lastError = `validation: ${validation.error}`;
        console.warn(`[saju] Validation failed on attempt ${attempt + 1}:`, validation.error);
        continue;
      }

      // Success — break out of retry loop
      // Cache + persist + return are handled below
      const reading = validation.data as SajuReading;

      setSajuCache(cacheKey, JSON.stringify(reading));

      const sessionId = request.headers.get("x-session-id") ?? "anonymous";
      const readingId = await saveReading({
        sessionId,
        readingType: "saju",
        inputData: input as unknown as Record<string, unknown>,
        precomputedData: preComputed as unknown as Record<string, unknown>,
        aiResult: reading as unknown as Record<string, unknown>,
        fortuneGrade: reading.overallGrade?.grade ?? null,
        destinyTypeHanja: reading.destinyType?.hanja ?? null,
        dayMaster: reading.dayMaster ?? null,
        celebrityMatch: reading.celebrityMatch?.korean?.name ?? null,
        ipHash: await hashIpSecure(ip),
      });

      return NextResponse.json({ reading, readingId, rawPillars, strength, yongShen, sajuChart });
    }

    // All retries exhausted
    console.error(`[saju] All ${MAX_RETRIES + 1} attempts failed. Last error: ${lastError}`);
    const errorMessages: Record<string, string> = {
      empty_response: "사주 분석 결과를 받지 못했습니다. 다시 시도해주세요.",
      json_parse: "사주 분석 결과를 처리할 수 없습니다. 다시 시도해주세요.",
    };
    return NextResponse.json(
      { error: errorMessages[lastError] ?? "사주 분석 결과가 불완전합니다. 다시 시도해주세요." },
      { status: 500 },
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack : "";
    console.error("Saju analysis error:", errMsg);
    console.error("Saju analysis stack:", errStack);
    return NextResponse.json(
      { error: "사주 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
