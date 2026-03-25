import { NextRequest, NextResponse } from "next/server";
import { validateEnv } from "@/lib/env";
import { ai, GEMINI_MODEL } from "@/lib/gwansang/gemini";
import {
  GWANSANG_SYSTEM_PROMPT,
  GWANSANG_USER_PROMPT,
} from "@/lib/gwansang/gwansang-prompt";
import { validateGwansangReading } from "@/lib/gwansang/validate";
import { checkIpRateLimitAsync, checkDailyCap, hashIpSecure } from "@/lib/rate-limit";
import { saveReading } from "@/lib/database";

const RATE_LIMIT = 10; // per IP per window
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  try {
    const env = validateEnv();
    if (!env.ok) {
      return NextResponse.json(
        { error: "서버 설정 오류입니다. 관리자에게 문의해주세요." },
        { status: 503 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    // Per-IP rate limit FIRST (don't consume daily cap for rate-limited users)
    if (!(await checkIpRateLimitAsync(ip, RATE_LIMIT, RATE_WINDOW_MS))) {
      return NextResponse.json(
        { error: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요." },
        { status: 429 },
      );
    }

    // Global daily cap
    const { allowed: dailyAllowed } = checkDailyCap();
    if (!dailyAllowed) {
      return NextResponse.json(
        { error: "오늘의 분석 횟수가 마감되었습니다. 내일 다시 시도해주세요!" },
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

    const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64 : "";
    const rawMimeType = typeof body.mimeType === "string" ? body.mimeType : "image/jpeg";

    if (!imageBase64) {
      return NextResponse.json(
        { error: "이미지가 제공되지 않았습니다." },
        { status: 400 },
      );
    }

    // Validate MIME type whitelist
    const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const mimeType = ALLOWED_MIME_TYPES.includes(rawMimeType) ? rawMimeType : "image/jpeg";

    // Validate base64 format
    if (!/^[A-Za-z0-9+/]+=*$/.test(imageBase64.slice(0, 100))) {
      return NextResponse.json(
        { error: "이미지 형식이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    // Validate base64 size (~5MB limit, accounting for padding)
    const paddingChars = (imageBase64.match(/=+$/) ?? [""])[0].length;
    const sizeInBytes = (imageBase64.length * 3) / 4 - paddingChars;
    if (sizeInBytes > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "이미지 크기가 너무 큽니다. 5MB 이하의 이미지를 사용해주세요." },
        { status: 400 },
      );
    }

    // Call Gemini Vision API with retry logic
    const MAX_RETRIES = 2;
    let lastError = "";

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: imageBase64,
                },
              },
              { text: GWANSANG_USER_PROMPT },
            ],
          },
        ],
        config: {
          systemInstruction: GWANSANG_SYSTEM_PROMPT,
          temperature: attempt === 0 ? 0.7 : 0.4,
          maxOutputTokens: 16384,
          responseMimeType: "application/json",
        },
      });

      const text = response.text ?? "";

      if (!text) {
        lastError = "empty_response";
        console.warn(`[gwansang] Empty response on attempt ${attempt + 1}`);
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
        console.warn(`[gwansang] JSON parse failed on attempt ${attempt + 1}:`, text.substring(0, 300));
        continue;
      }

      const validation = validateGwansangReading(parsed);
      if (!validation.ok) {
        lastError = `validation: ${validation.error}`;
        console.warn(`[gwansang] Validation failed on attempt ${attempt + 1}:`, validation.error);
        continue;
      }

      // Success — persist and return
      const sessionId = request.headers.get("x-session-id") ?? "anonymous";
      const readingId = await saveReading({
        sessionId,
        readingType: "gwansang",
        inputData: { mimeType },
        aiResult: validation.data as unknown as Record<string, unknown>,
        ipHash: await hashIpSecure(ip),
      });

      return NextResponse.json({ reading: validation.data, readingId });
    }

    // All retries exhausted
    console.error(`[gwansang] All ${MAX_RETRIES + 1} attempts failed. Last error: ${lastError}`);
    const errorMessages: Record<string, string> = {
      empty_response: "관상 분석 결과를 받지 못했습니다. 다시 시도해주세요.",
      json_parse: "관상 분석 결과를 처리할 수 없습니다. 다시 시도해주세요.",
    };
    return NextResponse.json(
      { error: errorMessages[lastError] ?? "관상 분석 결과가 불완전합니다. 다시 시도해주세요." },
      { status: 500 },
    );
  } catch (error) {
    console.error("Analysis error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "관상 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
