import { NextRequest, NextResponse } from "next/server";
import { ai, GEMINI_MODEL } from "@/lib/saju/gemini";
import { buildSajuSystemPrompt, buildSajuUserPrompt } from "@/lib/saju/saju-prompt";
import type { SajuInput, SajuReading } from "@/lib/saju/types";
import { validateSajuReading } from "@/lib/saju/validate";
import { calculateAllSystems } from "@/lib/saju/calculators";
import {
  checkIpRateLimit,
  checkDailyCap,
  buildSajuCacheKey,
  getSajuCache,
  setSajuCache,
} from "@/lib/rate-limit";
import { saveReading, hashIp } from "@/lib/database";

const RATE_LIMIT = 5; // per IP per window
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    // Per-IP rate limit
    if (!checkIpRateLimit(ip, RATE_LIMIT, RATE_WINDOW_MS)) {
      return NextResponse.json(
        { error: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const input = body as SajuInput;

    if (!input.birthYear || !input.birthMonth || !input.birthDay || !input.gender) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 },
      );
    }

    // Birth date range validation
    const currentYear = new Date().getFullYear();
    if (input.birthYear < 1920 || input.birthYear > currentYear) {
      return NextResponse.json(
        { error: "생년은 1920년에서 올해 사이여야 합니다." },
        { status: 400 },
      );
    }
    if (input.birthMonth < 1 || input.birthMonth > 12) {
      return NextResponse.json(
        { error: "월은 1에서 12 사이여야 합니다." },
        { status: 400 },
      );
    }
    if (input.birthDay < 1 || input.birthDay > 31) {
      return NextResponse.json(
        { error: "일은 1에서 31 사이여야 합니다." },
        { status: 400 },
      );
    }
    if (!["male", "female"].includes(input.gender)) {
      return NextResponse.json(
        { error: "성별이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    // ─── Pre-compute all calculations deterministically (needed for cache + API paths) ───
    let preComputed;
    try {
      preComputed = await calculateAllSystems(input);
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
        temperature: 0.6,
        maxOutputTokens: 24576,
        responseMimeType: "application/json",
      },
    });

    const text = response.text ?? "";

    if (!text) {
      return NextResponse.json(
        { error: "사주 분석 결과를 받지 못했습니다. 다시 시도해주세요." },
        { status: 500 },
      );
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
      console.error("JSON parse failed:", text.substring(0, 500));
      console.error("Parse error:", parseError);
      return NextResponse.json(
        { error: "사주 분석 결과를 처리할 수 없습니다. 다시 시도해주세요." },
        { status: 500 },
      );
    }

    // Runtime validation — prevent frontend crashes from malformed AI responses
    const validation = validateSajuReading(parsed, preComputed);
    if (!validation.ok) {
      console.error("Saju validation failed:", validation.error);
      return NextResponse.json(
        { error: "사주 분석 결과가 불완전합니다. 다시 시도해주세요." },
        { status: 500 },
      );
    }

    // ─── Cache the result ───
    setSajuCache(cacheKey, JSON.stringify(validation.data));

    // ─── Persist to database (non-blocking, doesn't fail the request) ───
    const sessionId = request.headers.get("x-session-id") ?? "anonymous";
    const reading = validation.data as SajuReading;
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
      ipHash: hashIp(ip),
    });

    return NextResponse.json({ reading, readingId, rawPillars, strength, yongShen, sajuChart });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Saju analysis error:", errMsg);
    return NextResponse.json(
      { error: `사주 분석 중 오류가 발생했습니다: ${errMsg.substring(0, 100)}` },
      { status: 500 },
    );
  }
}
