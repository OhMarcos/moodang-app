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
 * Improved Moon longitude calculation using Meeus algorithm (simplified).
 *
 * Based on Jean Meeus "Astronomical Algorithms" Chapter 47.
 * Uses the Moon's mean longitude with major correction terms
 * (mean anomaly, mean elongation, argument of latitude).
 *
 * Accuracy: ±2° (sufficient for Nakshatra determination within ±1).
 * For sub-degree precision, a full ephemeris (Swiss Ephemeris) is needed.
 *
 * Returns sidereal longitude (tropical - ayanamsa) for Vedic astrology.
 */
function approximateMoonLongitude(year: number, month: number, day: number): number {
  // Julian Day Number calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4)
    - Math.floor(y / 100) + Math.floor(y / 400) - 32045 + 0.5; // noon

  // Julian centuries from J2000.0
  const T = (jd - 2451545.0) / 36525.0;

  // Moon's mean longitude (L')
  const Lp = 218.3164477 + 481267.88123421 * T
    - 0.0015786 * T * T + T * T * T / 538841.0;

  // Moon's mean anomaly (M')
  const Mp = 134.9633964 + 477198.8675055 * T
    + 0.0087414 * T * T + T * T * T / 69699.0;

  // Moon's mean elongation (D)
  const D = 297.8501921 + 445267.1114034 * T
    - 0.0018819 * T * T + T * T * T / 545868.0;

  // Sun's mean anomaly (M)
  const M = 357.5291092 + 35999.0502909 * T
    - 0.0001536 * T * T;

  // Moon's argument of latitude (F)
  const F = 93.2720950 + 483202.0175233 * T
    - 0.0036539 * T * T;

  // Convert to radians
  const rad = Math.PI / 180;
  const MpR = Mp * rad;
  const DR = D * rad;
  const MR = M * rad;
  const FR = F * rad;

  // Major correction terms for longitude (simplified from Meeus Table 47.A)
  const dL = 6288774 * Math.sin(MpR)
    + 1274027 * Math.sin(2 * DR - MpR)
    + 658314 * Math.sin(2 * DR)
    + 213618 * Math.sin(2 * MpR)
    - 185116 * Math.sin(MR)
    - 114332 * Math.sin(2 * FR)
    + 58793 * Math.sin(2 * DR - 2 * MpR)
    + 57066 * Math.sin(2 * DR - MR - MpR)
    + 53322 * Math.sin(2 * DR + MpR)
    + 45758 * Math.sin(2 * DR - MR);

  // Tropical longitude
  let tropicalLong = Lp + dL / 1000000.0;
  tropicalLong = tropicalLong % 360;
  if (tropicalLong < 0) tropicalLong += 360;

  // Lahiri Ayanamsa (precession correction for Vedic/sidereal)
  // Lahiri ayanamsa at J2000.0 ≈ 23.85° with precession rate ≈ 50.27"/year
  const ayanamsa = 23.85 + (50.27 / 3600) * (year - 2000);

  let siderealLong = tropicalLong - ayanamsa;
  if (siderealLong < 0) siderealLong += 360;

  return siderealLong;
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

  // Guard: Meeus algorithm accuracy degrades outside ~1900-2100
  if (solar.year < 1900 || solar.year > 2100) {
    throw new Error(`Vedic calculation not supported for year ${solar.year}`);
  }

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
