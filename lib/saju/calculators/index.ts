import type { SajuInput } from "../types";
import type { PreComputedData, PreComputedVedic, PreComputedIChing } from "./types";
import { calculateSaju, lookupLongitude } from "./saju-engine";
import { calculateVedic } from "./vedic-engine";
import { calculateIChing } from "./iching-engine";

/**
 * Run all 3 calculation systems deterministically.
 * Returns pre-computed data ready for AI interpretation.
 *
 * Error isolation: Each engine runs independently.
 * - Saju engine failure is CRITICAL (throws to caller).
 * - Vedic/IChing failures use sensible defaults.
 */
export async function calculateAllSystems(input: SajuInput): Promise<PreComputedData> {
  const longitudeDeg = lookupLongitude(input.birthPlace);
  const fallbacksUsed: string[] = [];

  // Saju is the core engine — must succeed
  const saju = await calculateSaju(input);

  // Secondary engines: isolate failures with defaults
  let vedic: PreComputedVedic;
  try {
    vedic = calculateVedic(input);
  } catch (e) {
    console.error("[calculateAllSystems] Vedic engine failed, using fallback:", e);
    vedic = getVedicFallback(input);
    fallbacksUsed.push("vedic");
  }

  let iching: PreComputedIChing;
  try {
    iching = calculateIChing(input);
  } catch (e) {
    console.error("[calculateAllSystems] IChing engine failed, using fallback:", e);
    iching = getIChingFallback();
    fallbacksUsed.push("iching");
  }

  return {
    saju,
    vedic,
    iching,
    metadata: {
      calculatedAt: new Date().toISOString(),
      trueSolarTimeUsed: !!input.birthPlace,
      longitudeDeg,
      fallbacksUsed,
      birthHourUnknown: false, // overridden by caller if birth hour was unknown
    },
  };
}

// ─── Fallback defaults for non-critical engines ───

function getVedicFallback(input: SajuInput): PreComputedVedic {
  const currentYear = new Date().getFullYear();
  return {
    nakshatra: {
      index: 0, name: "Ashwini", nameKr: "아슈비니(Ashwini)",
      pada: 1, lord: "Ketu", lordKr: "케투",
      degrees: { start: 0, end: 13.33 },
    },
    mahadasha: {
      planet: "Unknown", planetKr: "미상",
      startYear: input.birthYear, endYear: input.birthYear + 10, totalYears: 10,
    },
    antardasha: {
      planet: "Unknown", planetKr: "미상",
      startYear: currentYear, endYear: currentYear + 2,
    },
    currentPhase: "stability",
  };
}

function getIChingFallback(): PreComputedIChing {
  return {
    hexagramNumber: 1,
    hexagramName: "건위천",
    hexagramHanja: "乾爲天",
    upperTrigram: { index: 0, name: "건(乾)", symbol: "☰" },
    lowerTrigram: { index: 0, name: "건(乾)", symbol: "☰" },
    changingLine: 1,
    transformedHexagram: { number: 44, name: "천풍구", hanja: "天風姤" },
  };
}

export { calculateSaju } from "./saju-engine";
export { calculateVedic } from "./vedic-engine";
export { calculateIChing } from "./iching-engine";
export type { PreComputedData } from "./types";
