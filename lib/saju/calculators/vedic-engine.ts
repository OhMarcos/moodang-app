import { getSolarDate } from "@gracefullight/saju";
import type { SajuInput } from "../types";
import type { PreComputedVedic } from "./types";

/** Resolve to solar date, converting if lunar calendar */
function resolveSolarDate(input: SajuInput): { year: number; month: number; day: number } {
  if (input.calendarType === "lunar") {
    try {
      return getSolarDate(input.birthYear, input.birthMonth, input.birthDay);
    } catch {
      return { year: input.birthYear, month: input.birthMonth, day: input.birthDay };
    }
  }
  return { year: input.birthYear, month: input.birthMonth, day: input.birthDay };
}

// ─── 27 Nakshatras (each spans 13°20' = 13.333°) ───
const NAKSHATRAS = [
  { name: "Ashwini", kr: "아슈비니", lord: "Ketu", lordKr: "케투" },
  { name: "Bharani", kr: "바라니", lord: "Venus", lordKr: "금성" },
  { name: "Krittika", kr: "크리티카", lord: "Sun", lordKr: "태양" },
  { name: "Rohini", kr: "로히니", lord: "Moon", lordKr: "달" },
  { name: "Mrigashirsha", kr: "므리가시르샤", lord: "Mars", lordKr: "화성" },
  { name: "Ardra", kr: "아르드라", lord: "Rahu", lordKr: "라후" },
  { name: "Punarvasu", kr: "푸나르바수", lord: "Jupiter", lordKr: "목성" },
  { name: "Pushya", kr: "푸시야", lord: "Saturn", lordKr: "토성" },
  { name: "Ashlesha", kr: "아슐레샤", lord: "Mercury", lordKr: "수성" },
  { name: "Magha", kr: "마가", lord: "Ketu", lordKr: "케투" },
  { name: "Purva Phalguni", kr: "푸르바 팔구니", lord: "Venus", lordKr: "금성" },
  { name: "Uttara Phalguni", kr: "우타라 팔구니", lord: "Sun", lordKr: "태양" },
  { name: "Hasta", kr: "하스타", lord: "Moon", lordKr: "달" },
  { name: "Chitra", kr: "치트라", lord: "Mars", lordKr: "화성" },
  { name: "Swati", kr: "스와티", lord: "Rahu", lordKr: "라후" },
  { name: "Vishakha", kr: "비샤카", lord: "Jupiter", lordKr: "목성" },
  { name: "Anuradha", kr: "아누라다", lord: "Saturn", lordKr: "토성" },
  { name: "Jyeshtha", kr: "지에시타", lord: "Mercury", lordKr: "수성" },
  { name: "Mula", kr: "물라", lord: "Ketu", lordKr: "케투" },
  { name: "Purva Ashadha", kr: "푸르바 아샤다", lord: "Venus", lordKr: "금성" },
  { name: "Uttara Ashadha", kr: "우타라 아샤다", lord: "Sun", lordKr: "태양" },
  { name: "Shravana", kr: "슈라바나", lord: "Moon", lordKr: "달" },
  { name: "Dhanishta", kr: "다니시타", lord: "Mars", lordKr: "화성" },
  { name: "Shatabhisha", kr: "샤타비샤", lord: "Rahu", lordKr: "라후" },
  { name: "Purva Bhadrapada", kr: "푸르바 바드라파다", lord: "Jupiter", lordKr: "목성" },
  { name: "Uttara Bhadrapada", kr: "우타라 바드라파다", lord: "Saturn", lordKr: "토성" },
  { name: "Revati", kr: "레바티", lord: "Mercury", lordKr: "수성" },
];

// ─── Vimshottari Dasha sequence (120-year cycle) ───
const DASHA_SEQUENCE = [
  { planet: "Ketu", kr: "케투(Ketu)", years: 7 },
  { planet: "Venus", kr: "금성(Venus)", years: 20 },
  { planet: "Sun", kr: "태양(Sun)", years: 6 },
  { planet: "Moon", kr: "달(Moon)", years: 10 },
  { planet: "Mars", kr: "화성(Mars)", years: 7 },
  { planet: "Rahu", kr: "라후(Rahu)", years: 18 },
  { planet: "Jupiter", kr: "목성(Jupiter)", years: 16 },
  { planet: "Saturn", kr: "토성(Saturn)", years: 19 },
  { planet: "Mercury", kr: "수성(Mercury)", years: 17 },
];

// ─── Phase mapping based on planet pair energy ───
const PHASE_MAP: Record<string, PreComputedVedic["currentPhase"]> = {
  Jupiter: "expansion",
  Venus: "expansion",
  Sun: "stability",
  Moon: "stability",
  Mercury: "transformation",
  Rahu: "transformation",
  Ketu: "transformation",
  Saturn: "contraction",
  Mars: "contraction",
};

/**
 * Simplified Moon longitude calculation.
 * Uses mean lunar period: Moon moves ~13.176° per day.
 * Reference: Moon at 0° Aries on Jan 1, 1900 (approximate epoch).
 */
function approximateMoonLongitude(year: number, month: number, day: number): number {
  const refDate = new Date(1900, 0, 1);
  const birthDate = new Date(year, month - 1, day);
  const daysDiff = (birthDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);

  // Mean daily motion of Moon = 13.176358°
  const moonLong = (daysDiff * 13.176358) % 360;
  return moonLong < 0 ? moonLong + 360 : moonLong;
}

function getNakshatraFromLongitude(longitude: number) {
  const nakshatraSpan = 360 / 27; // 13.333...°
  const index = Math.floor(longitude / nakshatraSpan) % 27;
  const posInNakshatra = longitude % nakshatraSpan;
  const pada = Math.floor(posInNakshatra / (nakshatraSpan / 4)) + 1;
  const start = index * nakshatraSpan;
  const end = start + nakshatraSpan;

  return {
    index,
    nakshatra: NAKSHATRAS[index],
    pada: Math.min(pada, 4),
    degrees: { start: Math.round(start * 100) / 100, end: Math.round(end * 100) / 100 },
  };
}

function getDashaStartIndex(lordPlanet: string): number {
  return DASHA_SEQUENCE.findIndex((d) => d.planet === lordPlanet);
}

function calculateDashaPeriods(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  nakshatraLord: string,
  currentYear: number,
): { mahadasha: PreComputedVedic["mahadasha"]; antardasha: PreComputedVedic["antardasha"] } {
  const startIdx = getDashaStartIndex(nakshatraLord);
  if (startIdx === -1) {
    return {
      mahadasha: { planet: "Unknown", planetKr: "미상", startYear: birthYear, endYear: birthYear + 10, totalYears: 10 },
      antardasha: { planet: "Unknown", planetKr: "미상", startYear: currentYear, endYear: currentYear + 2 },
    };
  }

  // Build 120-year dasha timeline from birth
  let yearCursor = birthYear;
  let mahadasha: PreComputedVedic["mahadasha"] | null = null;

  for (let cycle = 0; cycle < 2; cycle++) {
    for (let i = 0; i < 9; i++) {
      const idx = (startIdx + i) % 9;
      const dasha = DASHA_SEQUENCE[idx];
      const endYear = yearCursor + dasha.years;

      if (currentYear >= yearCursor && currentYear < endYear) {
        mahadasha = {
          planet: dasha.planet,
          planetKr: dasha.kr,
          startYear: yearCursor,
          endYear: endYear,
          totalYears: dasha.years,
        };
        break;
      }
      yearCursor = endYear;
    }
    if (mahadasha) break;
  }

  if (!mahadasha) {
    const fallback = DASHA_SEQUENCE[startIdx];
    mahadasha = {
      planet: fallback.planet,
      planetKr: fallback.kr,
      startYear: currentYear,
      endYear: currentYear + fallback.years,
      totalYears: fallback.years,
    };
  }

  // Calculate Antardasha within current Mahadasha
  const mahaIdx = DASHA_SEQUENCE.findIndex((d) => d.planet === mahadasha!.planet);
  const totalMahaYears = mahadasha.totalYears;
  const mahaStartYear = mahadasha.startYear;
  let antarCursor = mahaStartYear;
  let antardasha: PreComputedVedic["antardasha"] = {
    planet: mahadasha.planet,
    planetKr: mahadasha.planetKr,
    startYear: currentYear,
    endYear: currentYear + 1,
  };

  for (let i = 0; i < 9; i++) {
    const idx = (mahaIdx + i) % 9;
    const dasha = DASHA_SEQUENCE[idx];
    // Antardasha duration = (maha years × sub years) / 120 * total maha years
    const antarYears = (totalMahaYears * dasha.years) / 120;
    const antarEnd = antarCursor + antarYears;

    if (currentYear >= antarCursor && currentYear < antarEnd) {
      antardasha = {
        planet: dasha.planet,
        planetKr: dasha.kr,
        startYear: Math.round(antarCursor),
        endYear: Math.round(antarEnd),
      };
      break;
    }
    antarCursor = antarEnd;
  }

  return { mahadasha, antardasha };
}

export function calculateVedic(input: SajuInput): PreComputedVedic {
  const solar = resolveSolarDate(input);
  const currentYear = new Date().getFullYear();

  const moonLong = approximateMoonLongitude(solar.year, solar.month, solar.day);
  const { index, nakshatra, pada, degrees } = getNakshatraFromLongitude(moonLong);

  const { mahadasha, antardasha } = calculateDashaPeriods(
    solar.year, solar.month, solar.day,
    nakshatra.lord,
    currentYear,
  );

  const currentPhase = PHASE_MAP[mahadasha.planet] ?? "stability";

  return {
    nakshatra: {
      index,
      name: nakshatra.name,
      nameKr: `${nakshatra.kr}(${nakshatra.name})`,
      pada,
      lord: nakshatra.lord,
      lordKr: nakshatra.lordKr,
      degrees,
    },
    mahadasha,
    antardasha,
    currentPhase,
  };
}
