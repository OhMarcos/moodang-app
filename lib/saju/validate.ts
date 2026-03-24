/**
 * Runtime validation for SajuReading from Gemini API.
 * Ensures all required fields exist and have correct types
 * to prevent frontend crashes from malformed AI responses.
 *
 * When preComputed data is provided, cross-validates that
 * the AI response matches the deterministic calculations.
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

function isFortuneCategory(v: unknown): boolean {
  if (!isObj(v)) return false;
  return hasNumbers(v, ["score", "percentile"]) && hasStrings(v, ["summary", "detail", "advice"]);
}

/**
 * Cross-validate AI output against pre-computed data.
 * Logs warnings but does not reject — AI interpretation may rephrase labels.
 */
function crossValidate(reading: SajuReading, preComputed: PreComputedData): void {
  const warnings: string[] = [];

  // Check elementBalance matches
  const eb = reading.elementBalance;
  const peb = preComputed.saju.elementBalance;
  if (eb) {
    for (const key of ["wood", "fire", "earth", "metal", "water"] as const) {
      if (Math.abs(eb[key] - peb[key]) > 5) {
        warnings.push(`elementBalance.${key}: AI=${eb[key]}, expected=${peb[key]}`);
      }
    }
  }

  // Check hexagram number
  const iching = reading.iChing;
  if (iching && iching.hexagramNumber !== preComputed.iching.hexagramNumber) {
    warnings.push(`hexagramNumber: AI=${iching.hexagramNumber}, expected=${preComputed.iching.hexagramNumber}`);
  }

  // Check lifePath number
  const num = reading.numerology;
  if (num?.lifePath && num.lifePath.number !== preComputed.numerology.lifePath) {
    warnings.push(`lifePath: AI=${num.lifePath.number}, expected=${preComputed.numerology.lifePath}`);
  }

  // Check personalYear number
  if (num?.personalYear && num.personalYear.number !== preComputed.numerology.personalYear) {
    warnings.push(`personalYear: AI=${num.personalYear.number}, expected=${preComputed.numerology.personalYear}`);
  }

  if (warnings.length > 0) {
    console.warn("[Saju Cross-Validation] AI deviated from pre-computed data:", warnings);
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

  // Life Narrative
  if (!isObj(r.lifeNarrative)) return { ok: false, error: "lifeNarrative 누락" };
  if (!hasStrings(r.lifeNarrative, ["past", "present", "future", "lifeTheme"])) {
    return { ok: false, error: "lifeNarrative 불완전" };
  }

  // Fortunes
  if (!isObj(r.fortunes)) return { ok: false, error: "fortunes 누락" };
  const fortunes = r.fortunes as Record<string, unknown>;
  for (const key of ["wealth", "love", "career", "health", "fame"]) {
    if (!isFortuneCategory(fortunes[key])) return { ok: false, error: `fortunes.${key} 누락/불완전` };
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

  // Cross-validate against pre-computed data if provided
  if (preComputed) {
    crossValidate(reading, preComputed);
  }

  return { ok: true, data: reading };
}
