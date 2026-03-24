import type { SajuInput } from "../types";
import type { PreComputedData, PreComputedVedic, PreComputedIChing, PreComputedNumerology } from "./types";
import { calculateSaju, lookupLongitude } from "./saju-engine";
import { calculateVedic } from "./vedic-engine";
import { calculateIChing } from "./iching-engine";
import { calculateNumerology } from "./numerology-engine";

/**
 * Run all 4 calculation systems deterministically.
 * Returns pre-computed data ready for AI interpretation.
 *
 * Error isolation: Each engine runs independently.
 * - Saju engine failure is CRITICAL (throws to caller).
 * - Vedic/IChing/Numerology failures use sensible defaults.
 */
export async function calculateAllSystems(input: SajuInput): Promise<PreComputedData> {
  const longitudeDeg = lookupLongitude(input.birthPlace);

  // Saju is the core engine — must succeed
  const saju = await calculateSaju(input);

  // Secondary engines: isolate failures with defaults
  let vedic: PreComputedVedic;
  try {
    vedic = calculateVedic(input);
  } catch (e) {
    console.error("[calculateAllSystems] Vedic engine failed, using fallback:", e);
    vedic = getVedicFallback(input);
  }

  let iching: PreComputedIChing;
  try {
    iching = calculateIChing(input);
  } catch (e) {
    console.error("[calculateAllSystems] IChing engine failed, using fallback:", e);
    iching = getIChingFallback();
  }

  let numerology: PreComputedNumerology;
  try {
    numerology = calculateNumerology(input);
  } catch (e) {
    console.error("[calculateAllSystems] Numerology engine failed, using fallback:", e);
    numerology = getNumerologyFallback();
  }

  return {
    saju,
    vedic,
    iching,
    numerology,
    metadata: {
      calculatedAt: new Date().toISOString(),
      trueSolarTimeUsed: !!input.birthPlace,
      longitudeDeg,
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

function getNumerologyFallback(): PreComputedNumerology {
  return {
    lifePath: 1,
    personalYear: 1,
    personalYearTheme: "새로운 시작의 해",
    expressionNumber: null,
    soulUrge: null,
  };
}

export { calculateSaju } from "./saju-engine";
export { calculateVedic } from "./vedic-engine";
export { calculateIChing } from "./iching-engine";
export { calculateNumerology } from "./numerology-engine";
export type { PreComputedData } from "./types";
