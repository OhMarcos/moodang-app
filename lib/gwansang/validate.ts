/**
 * Runtime validation for GwansangReading from Gemini API.
 * Ensures all required fields exist and have correct types
 * to prevent frontend crashes from malformed AI responses.
 * Clamps scores to valid ranges.
 */
import type { GwansangReading, FeatureAnalysis, FortuneReading, ViralScores } from "./types";

/** Clamp a number to [min, max] range */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function isFeatureAnalysis(v: unknown): v is FeatureAnalysis {
  if (!v || typeof v !== "object") return false;
  const f = v as Record<string, unknown>;
  return typeof f.type === "string" && typeof f.description === "string" && typeof f.rating === "number";
}

/** Clamp feature rating to 1-10 range */
function clampFeatureAnalysis(v: FeatureAnalysis): void {
  v.rating = clamp(v.rating, 1, 10);
}

function isFortuneReading(v: unknown): v is FortuneReading {
  if (!v || typeof v !== "object") return false;
  const f = v as Record<string, unknown>;
  return (
    typeof f.score === "number" &&
    typeof f.summary === "string" &&
    typeof f.detail === "string" &&
    typeof f.advice === "string"
  );
}

/** Clamp fortune score to 0-100 range */
function clampFortuneReading(v: FortuneReading): void {
  v.score = clamp(v.score, 0, 100);
}

function isViralScores(v: unknown): v is ViralScores {
  if (!v || typeof v !== "object") return false;
  const s = v as Record<string, unknown>;
  return (
    typeof s.sexAppeal === "number" &&
    typeof s.sharpMind === "number" &&
    typeof s.wealthPotential === "number" &&
    typeof s.peopleLuck === "number" &&
    typeof s.mainCharacterEnergy === "number"
  );
}

/** Clamp all viral scores to 0-100 range */
function clampViralScores(v: ViralScores): void {
  v.sexAppeal = clamp(v.sexAppeal, 0, 100);
  v.sharpMind = clamp(v.sharpMind, 0, 100);
  v.wealthPotential = clamp(v.wealthPotential, 0, 100);
  v.peopleLuck = clamp(v.peopleLuck, 0, 100);
  v.mainCharacterEnergy = clamp(v.mainCharacterEnergy, 0, 100);
}

const REQUIRED_FEATURES = ["forehead", "eyebrows", "eyes", "nose", "mouth", "ears", "chin"] as const;
const REQUIRED_FORTUNES = ["wealth", "love", "career", "health", "relationships"] as const;

export function validateGwansangReading(raw: unknown): { ok: true; data: GwansangReading } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "응답이 객체가 아닙니다." };
  }

  const r = raw as Record<string, unknown>;

  // Required string fields
  if (typeof r.overallImpression !== "string") return { ok: false, error: "overallImpression 누락" };
  if (typeof r.faceShape !== "string") return { ok: false, error: "faceShape 누락" };
  if (typeof r.lifeAdvice !== "string") return { ok: false, error: "lifeAdvice 누락" };

  // Features — validate and clamp ratings
  if (!r.features || typeof r.features !== "object") return { ok: false, error: "features 누락" };
  const features = r.features as Record<string, unknown>;
  for (const key of REQUIRED_FEATURES) {
    if (!isFeatureAnalysis(features[key])) return { ok: false, error: `features.${key} 누락/불완전` };
    clampFeatureAnalysis(features[key] as FeatureAnalysis);
  }

  // Fortunes — validate and clamp scores
  if (!r.fortunes || typeof r.fortunes !== "object") return { ok: false, error: "fortunes 누락" };
  const fortunes = r.fortunes as Record<string, unknown>;
  for (const key of REQUIRED_FORTUNES) {
    if (!isFortuneReading(fortunes[key])) return { ok: false, error: `fortunes.${key} 누락/불완전` };
    clampFortuneReading(fortunes[key] as FortuneReading);
  }

  // Viral Scores — validate and clamp
  if (!isViralScores(r.viralScores)) return { ok: false, error: "viralScores 누락/불완전" };
  clampViralScores(r.viralScores as ViralScores);

  // Lucky Elements
  if (!r.luckyElements || typeof r.luckyElements !== "object") return { ok: false, error: "luckyElements 누락" };
  const luck = r.luckyElements as Record<string, unknown>;
  if (typeof luck.color !== "string" || typeof luck.number !== "number" || typeof luck.direction !== "string") {
    return { ok: false, error: "luckyElements 필드 불완전" };
  }
  luck.number = clamp(luck.number as number, 1, 99);

  return { ok: true, data: raw as GwansangReading };
}
