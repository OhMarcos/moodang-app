import { NextRequest, NextResponse } from "next/server";
import { ai, GEMINI_MODEL } from "@/lib/gwansang/gemini";
import {
  GWANSANG_SYSTEM_PROMPT,
  GWANSANG_USER_PROMPT,
} from "@/lib/gwansang/gwansang-prompt";
import { validateGwansangReading } from "@/lib/gwansang/validate";
import { checkIpRateLimit, checkDailyCap } from "@/lib/rate-limit";
import { saveReading, hashIp } from "@/lib/database";

const RATE_LIMIT = 10; // per IP per window
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    // Global daily cap
    const { allowed: dailyAllowed } = checkDailyCap();
    if (!dailyAllowed) {
      return NextResponse.json(
        { error: "오늘의 분석 횟수가 마감되었습니다. 내일 다시 시도해주세요!" },
        { status: 429 },
      );
    }

    // Per-IP rate limit
    if (!checkIpRateLimit(ip, RATE_LIMIT, RATE_WINDOW_MS)) {
      return NextResponse.json(
        { error: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { imageBase64, mimeType } = body as { imageBase64?: string; mimeType?: string };

    if (!imageBase64) {
      return NextResponse.json(
        { error: "이미지가 제공되지 않았습니다." },
        { status: 400 },
      );
    }

    // Validate base64 size (~5MB limit)
    const sizeInBytes = (imageBase64.length * 3) / 4;
    if (sizeInBytes > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "이미지 크기가 너무 큽니다. 5MB 이하의 이미지를 사용해주세요." },
        { status: 400 },
      );
    }

    // Call Gemini Vision API
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType ?? "image/jpeg",
                data: imageBase64,
              },
            },
            { text: GWANSANG_USER_PROMPT },
          ],
        },
      ],
      config: {
        systemInstruction: GWANSANG_SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 16384,
        responseMimeType: "application/json",
      },
    });

    const text = response.text ?? "";

    if (!text) {
      console.error("Empty Gemini response");
      return NextResponse.json(
        { error: "관상 분석 결과를 받지 못했습니다. 다시 시도해주세요." },
        { status: 500 },
      );
    }

    // Extract JSON
    let jsonStr = text;
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch?.[1]) {
      jsonStr = codeBlockMatch[1];
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("JSON parse failed. Raw response:", text.substring(0, 500));
      console.error("Parse error:", parseError);
      return NextResponse.json(
        { error: "관상 분석 결과를 처리할 수 없습니다. 다시 시도해주세요." },
        { status: 500 },
      );
    }

    // Runtime validation — prevent frontend crashes from malformed AI responses
    const validation = validateGwansangReading(parsed);
    if (!validation.ok) {
      console.error("Gwansang validation failed:", validation.error);
      return NextResponse.json(
        { error: "관상 분석 결과가 불완전합니다. 다시 시도해주세요." },
        { status: 500 },
      );
    }

    // ─── Persist to database (non-blocking) ───
    const sessionId = request.headers.get("x-session-id") ?? "anonymous";
    const readingId = await saveReading({
      sessionId,
      readingType: "gwansang",
      inputData: { mimeType: mimeType ?? "image/jpeg" },
      aiResult: validation.data as unknown as Record<string, unknown>,
      ipHash: hashIp(ip),
    });

    return NextResponse.json({ reading: validation.data, readingId });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Analysis error:", errMsg);
    return NextResponse.json(
      { error: `관상 분석 중 오류가 발생했습니다: ${errMsg.substring(0, 100)}` },
      { status: 500 },
    );
  }
}
