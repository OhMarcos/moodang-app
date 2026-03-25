/**
 * Runtime validation for SajuReading from Gemini API.
 * Ensures all required fields exist and have correct types
 * to prevent frontend crashes from malformed AI responses.
 *
 * When preComputed data is provided, cross-validates that
 * the AI response matches the deterministic calculations.
 * Corrects AI deviations for critical algorithmic fields.
 */
import type { SajuReading } from "./types";
import type { PreComputedData } from "./calculators/types";

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}

function hasStrings(obj: Record<string, unknown>, keys: string[]): boolean {
  return keys.every((k) => typeof obj[k] === "string");
}

function hasNumbers(obj: Record<string, unknown>, keys: string[]): boolean {
  return keys.every((k) => typeof obj[k] === "number");
}

/** Clamp a number to [min, max] range */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function isFortuneCategory(v: unknown): boolean {
  if (!isObj(v)) return false;
  return hasNumbers(v, ["score", "percentile"]) && hasStrings(v, ["summary", "detail", "advice"]);
}

/** Clamp fortune category scores to valid ranges */
function clampFortuneCategory(v: Record<string, unknown>): void {
  if (typeof v.score === "number") v.score = clamp(v.score, 0, 100);
  if (typeof v.percentile === "number") v.percentile = clamp(v.percentile, 0, 100);
}

/**
 * Cross-validate AI output against pre-computed data.
 * Corrects critical deviations (elementBalance, hexagram) to match
 * deterministic calculations. Logs all corrections.
 */
function crossValidate(reading: SajuReading, preComputed: PreComputedData): void {
  const corrections: string[] = [];

  // Correct elementBalance to match pre-computed values
  const eb = reading.elementBalance;
  const peb = preComputed.saju.elementBalance;
  if (eb) {
    for (const key of ["wood", "fire", "earth", "metal", "water"] as const) {
      if (Math.abs(eb[key] - peb[key]) > 10) {
        corrections.push(`elementBalance.${key}: AI=${eb[key]} → corrected=${peb[key]}`);
        eb[key] = peb[key];
      }
    }
  }

  // Correct hexagram number if AI deviates
  const iching = reading.iChing;
  if (iching && iching.hexagramNumber !== preComputed.iching.hexagramNumber) {
    corrections.push(`hexagramNumber: AI=${iching.hexagramNumber} → corrected=${preComputed.iching.hexagramNumber}`);
    iching.hexagramNumber = preComputed.iching.hexagramNumber;
    iching.hexagramName = preComputed.iching.hexagramName;
    iching.hexagramHanja = preComputed.iching.hexagramHanja;
  }

  if (corrections.length > 0) {
    console.warn("[Saju Cross-Validation] Corrected AI deviations:", corrections);
  }
}

/**
 * Normalize elementBalance so sum ≈ 100.
 * Handles cases where AI returns raw counts or off-scale values.
 */
function normalizeElementBalance(eb: Record<string, unknown>): void {
  const keys = ["wood", "fire", "earth", "metal", "water"] as const;
  const total = keys.reduce((sum, k) => sum + (typeof eb[k] === "number" ? (eb[k] as number) : 0), 0);

  if (total > 0 && (total < 90 || total > 110)) {
    for (const key of keys) {
      if (typeof eb[key] === "number") {
        eb[key] = Math.round(((eb[key] as number) / total) * 100);
      }
    }
  }
}

export function validateSajuReading(
  raw: unknown,
  preComputed?: PreComputedData,
): { ok: true; data: SajuReading } | { ok: false; error: string } {
  if (!isObj(raw)) return { ok: false, error: "응답이 객체가 아닙니다." };

  const r = raw as Record<string, unknown>;

  // Core string fields
  if (typeof r.dayMaster !== "string") return { ok: false, error: "dayMaster 누락" };
  if (typeof r.dayMasterDescription !== "string") return { ok: false, error: "dayMasterDescription 누락" };
  if (typeof r.personality !== "string") return { ok: false, error: "personality 누락" };

  // Element Balance
  if (!isObj(r.elementBalance)) return { ok: false, error: "elementBalance 누락" };
  if (!hasNumbers(r.elementBalance, ["wood", "fire", "earth", "metal", "water"])) {
    return { ok: false, error: "elementBalance 불완전" };
  }
  normalizeElementBalance(r.elementBalance);

  // Destiny Type
  if (!isObj(r.destinyType)) return { ok: false, error: "destinyType 누락" };
  if (!hasStrings(r.destinyType, ["hanja", "hangul", "title", "description"])) {
    return { ok: false, error: "destinyType 불완전" };
  }

  // Overall Grade
  if (!isObj(r.overallGrade)) return { ok: false, error: "overallGrade 누락" };
  if (typeof r.overallGrade.grade !== "string" || typeof r.overallGrade.nationalPercentile !== "number") {
    return { ok: false, error: "overallGrade 불완전" };
  }
  r.overallGrade.nationalPercentile = clamp(r.overallGrade.nationalPercentile as number, 0, 100);

  // Life Narrative
  if (!isObj(r.lifeNarrative)) return { ok: false, error: "lifeNarrative 누락" };
  if (!hasStrings(r.lifeNarrative, ["past", "present", "future", "lifeTheme"])) {
    return { ok: false, error: "lifeNarrative 불완전" };
  }

  // Fortunes — validate and clamp scores
  if (!isObj(r.fortunes)) return { ok: false, error: "fortunes 누락" };
  const fortunes = r.fortunes as Record<string, unknown>;
  for (const key of ["wealth", "love", "career", "health", "fame"]) {
    if (!isFortuneCategory(fortunes[key])) return { ok: false, error: `fortunes.${key} 누락/불완전` };
    clampFortuneCategory(fortunes[key] as Record<string, unknown>);
  }

  // Hidden Self
  if (!isObj(r.hiddenSelf)) return { ok: false, error: "hiddenSelf 누락" };

  // Yearly Fortune
  if (!isObj(r.yearlyFortune)) return { ok: false, error: "yearlyFortune 누락" };

  // Lucky Elements
  if (!isObj(r.luckyElements)) return { ok: false, error: "luckyElements 누락" };

  // Compatibility
  if (!isObj(r.compatibility)) return { ok: false, error: "compatibility 누락" };

  const reading = raw as unknown as SajuReading;

  // Cross-validate and correct against pre-computed data if provided
  if (preComputed) {
    crossValidate(reading, preComputed);
  }

  return { ok: true, data: reading };
}
