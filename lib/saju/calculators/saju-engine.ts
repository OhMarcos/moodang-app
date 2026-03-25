import {
  getSaju,
  getSolarDate,
  type SajuResult,
  type GetSajuOptions,
  getElementRecommendations,
  getCurrentMajorLuck,
} from "@gracefullight/saju";
import { createDateFnsAdapter } from "@gracefullight/saju/adapters/date-fns";
import type { SajuInput } from "../types";
import type { PreComputedSaju, PillarData, PillarTenGods, TenGodEntry, TwelveStageInfo, SinsalInfo } from "./types";

// ─── Korean labels for stems ───
const STEM_KR: Record<string, string> = {
  "甲": "갑", "乙": "을", "丙": "병", "丁": "정", "戊": "무",
  "己": "기", "庚": "경", "辛": "신", "壬": "임", "癸": "계",
};

const BRANCH_KR: Record<string, string> = {
  "子": "자", "丑": "축", "寅": "인", "卯": "묘", "辰": "진", "巳": "사",
  "午": "오", "未": "미", "申": "신", "酉": "유", "戌": "술", "亥": "해",
};

const ELEMENT_KR: Record<string, string> = {
  wood: "목(木)", fire: "화(火)", earth: "토(土)", metal: "금(金)", water: "수(水)",
};

const POLARITY_KR: Record<string, string> = {
  yang: "양(陽)", yin: "음(陰)",
};

// ─── City to longitude + timezone mapping ───
interface CityInfo { lng: number; tz: number }
const CITY_MAP: Record<string, CityInfo> = {
  // Korea (KST +9)
  "서울": { lng: 126.98, tz: 9 }, "부산": { lng: 129.08, tz: 9 },
  "대구": { lng: 128.60, tz: 9 }, "인천": { lng: 126.71, tz: 9 },
  "광주": { lng: 126.85, tz: 9 }, "대전": { lng: 127.38, tz: 9 },
  "울산": { lng: 129.31, tz: 9 }, "세종": { lng: 127.00, tz: 9 },
  "수원": { lng: 127.01, tz: 9 }, "창원": { lng: 128.68, tz: 9 },
  "고양": { lng: 126.83, tz: 9 }, "용인": { lng: 127.18, tz: 9 },
  "성남": { lng: 127.14, tz: 9 }, "청주": { lng: 127.49, tz: 9 },
  "전주": { lng: 127.15, tz: 9 }, "천안": { lng: 127.15, tz: 9 },
  "제주": { lng: 126.53, tz: 9 }, "포항": { lng: 129.37, tz: 9 },
  "경주": { lng: 129.22, tz: 9 }, "춘천": { lng: 127.73, tz: 9 },
  "원주": { lng: 127.95, tz: 9 }, "강릉": { lng: 128.90, tz: 9 },
  "목포": { lng: 126.39, tz: 9 }, "여수": { lng: 127.66, tz: 9 },
  "평택": { lng: 127.11, tz: 9 }, "김포": { lng: 126.72, tz: 9 },
  "파주": { lng: 126.77, tz: 9 }, "남양주": { lng: 127.22, tz: 9 },
  // Japan (JST +9)
  "tokyo": { lng: 139.69, tz: 9 }, "도쿄": { lng: 139.69, tz: 9 },
  "osaka": { lng: 135.50, tz: 9 }, "오사카": { lng: 135.50, tz: 9 },
  // China (CST +8)
  "beijing": { lng: 116.41, tz: 8 }, "베이징": { lng: 116.41, tz: 8 },
  "shanghai": { lng: 121.47, tz: 8 }, "상하이": { lng: 121.47, tz: 8 },
  // North America (EST -5, PST -8, CST -6)
  "new york": { lng: -74.01, tz: -5 }, "뉴욕": { lng: -74.01, tz: -5 },
  "los angeles": { lng: -118.24, tz: -8 }, "로스앤젤레스": { lng: -118.24, tz: -8 }, "LA": { lng: -118.24, tz: -8 },
  "chicago": { lng: -87.63, tz: -6 }, "시카고": { lng: -87.63, tz: -6 },
  "toronto": { lng: -79.38, tz: -5 }, "토론토": { lng: -79.38, tz: -5 },
  "vancouver": { lng: -123.12, tz: -8 }, "밴쿠버": { lng: -123.12, tz: -8 },
  // Europe
  "london": { lng: -0.12, tz: 0 }, "런던": { lng: -0.12, tz: 0 },
  "paris": { lng: 2.35, tz: 1 }, "파리": { lng: 2.35, tz: 1 },
  "berlin": { lng: 13.41, tz: 1 }, "베를린": { lng: 13.41, tz: 1 },
  // Oceania
  "sydney": { lng: 151.21, tz: 10 }, "시드니": { lng: 151.21, tz: 10 },
  "melbourne": { lng: 144.96, tz: 10 }, "멜버른": { lng: 144.96, tz: 10 },
  "auckland": { lng: 174.76, tz: 12 }, "오클랜드": { lng: 174.76, tz: 12 },
  // SE Asia
  "singapore": { lng: 103.82, tz: 8 }, "싱가포르": { lng: 103.82, tz: 8 },
  "bangkok": { lng: 100.50, tz: 7 }, "방콕": { lng: 100.50, tz: 7 },
  "hanoi": { lng: 105.85, tz: 7 }, "하노이": { lng: 105.85, tz: 7 },
};

function lookupCity(birthPlace?: string): CityInfo {
  if (!birthPlace) return { lng: 126.98, tz: 9 }; // Seoul default
  const normalized = birthPlace.trim().toLowerCase();
  for (const [city, info] of Object.entries(CITY_MAP)) {
    if (normalized.includes(city.toLowerCase())) return info;
  }
  return { lng: 126.98, tz: 9 }; // Fallback to Seoul
}

/** @deprecated Use lookupCity instead — kept for backward compat with index.ts */
function lookupLongitude(birthPlace?: string): number {
  return lookupCity(birthPlace).lng;
}

function parsePillar(pillarStr: string): PillarData {
  if (!pillarStr || pillarStr.length < 2) {
    return { stem: "?", branch: "?", pillar: pillarStr ?? "??", stemKr: "?", branchKr: "?" };
  }
  const stem = pillarStr[0];
  const branch = pillarStr[1];
  return {
    stem,
    branch,
    pillar: pillarStr,
    stemKr: STEM_KR[stem] ?? stem,
    branchKr: BRANCH_KR[branch] ?? branch,
  };
}

function mapTenGodEntry(label: { key?: string; korean?: string; hanja?: string } | undefined | null): TenGodEntry {
  return { key: label?.key ?? "unknown", korean: label?.korean ?? "미상", hanja: label?.hanja ?? "未詳" };
}

function mapPillarTenGods(
  pillar: SajuResult["tenGods"]["year"] | SajuResult["tenGods"]["day"],
): PillarTenGods {
  return {
    stem: {
      char: pillar.stem.char,
      tenGod: mapTenGodEntry(pillar.stem.tenGod as { key: string; korean: string; hanja: string } | undefined),
    },
    branch: {
      char: pillar.branch.char,
      tenGod: mapTenGodEntry(pillar.branch.tenGod),
      hiddenStems: (pillar.branch.hiddenStems ?? []).map((hs) => ({
        stem: hs.stem,
        tenGod: mapTenGodEntry(hs.tenGod),
      })),
    },
  };
}

/**
 * Convert lunar date to solar date if calendarType is "lunar".
 * Returns solar year/month/day to pass to the saju library.
 */
function resolveSolarDate(input: SajuInput): { year: number; month: number; day: number } {
  if (input.calendarType === "lunar") {
    try {
      const solar = getSolarDate(input.birthYear, input.birthMonth, input.birthDay);
      return solar;
    } catch (e) {
      console.warn("[saju-engine] Lunar→Solar conversion failed, using raw date:", e);
      return { year: input.birthYear, month: input.birthMonth, day: input.birthDay };
    }
  }
  return { year: input.birthYear, month: input.birthMonth, day: input.birthDay };
}

function mapTwelveStage(stage: SajuResult["twelveStages"]["year"] | undefined | null): TwelveStageInfo {
  return {
    key: stage?.key ?? "unknown",
    korean: stage?.korean ?? "미상",
    hanja: stage?.hanja ?? "未詳",
    meaning: stage?.meaning ?? "",
    strength: stage?.strength ?? "neutral",
  };
}

function mapSinsalsByPosition(sinsalResult: SajuResult["sinsals"]): {
  year: SinsalInfo[]; month: SinsalInfo[]; day: SinsalInfo[]; hour: SinsalInfo[];
} {
  const result = { year: [] as SinsalInfo[], month: [] as SinsalInfo[], day: [] as SinsalInfo[], hour: [] as SinsalInfo[] };
  for (const match of (sinsalResult?.matches ?? [])) {
    const sinsal = match?.sinsal;
    const pos = match?.position;
    const info: SinsalInfo = {
      key: sinsal?.key ?? "unknown",
      korean: sinsal?.korean ?? "미상",
      hanja: sinsal?.hanja ?? "",
      meaning: sinsal?.meaning ?? "",
      type: sinsal?.type ?? "unknown",
      position: pos ?? "year",
    };
    if (pos && result[pos]) {
      result[pos].push(info);
    }
  }
  return result;
}

export async function calculateSaju(input: SajuInput): Promise<PreComputedSaju> {
  const adapter = await createDateFnsAdapter();
  const cityInfo = lookupCity(input.birthPlace);

  // Convert lunar → solar if needed
  const solar = resolveSolarDate(input);

  const birthDate = adapter.createUTC(
    solar.year,
    solar.month,
    solar.day,
    input.birthHour,
    input.birthMinute,
    0,
  );

  const currentYear = new Date().getFullYear();
  const birthYear = solar.year;
  const currentAge = currentYear - birthYear + 1; // Korean age

  const options: GetSajuOptions<typeof birthDate> = {
    adapter,
    longitudeDeg: cityInfo.lng,
    gender: input.gender as "male" | "female",
    tzOffsetHours: cityInfo.tz,
    currentYear,
    yearlyLuckRange: { from: currentYear - 1, to: currentYear + 3 },
  };

  const result = getSaju(birthDate, options);

  // Parse pillars (defensive)
  const yearPillar = parsePillar(result.pillars.year);
  const monthPillar = parsePillar(result.pillars.month);
  const dayPillar = parsePillar(result.pillars.day);
  const hourPillar = parsePillar(result.pillars.hour);

  // Day master info
  const dayStem = dayPillar.stem;
  const dayMasterElement = getStemElement(dayStem);
  const dayMasterPolarity = getStemPolarity(dayStem);

  // YongShen recommendations
  const recommendations = getElementRecommendations(result.yongShen);

  // Current major luck (may be null for very young/old people)
  const currentMajorLuck = getCurrentMajorLuck(result.majorLuck, currentAge);

  // Element balance from pillars
  const elementCounts = countElementsFromPillars(result);

  // Twelve stages (12운성) — from library
  const twelveStages = {
    year: mapTwelveStage(result.twelveStages.year),
    month: mapTwelveStage(result.twelveStages.month),
    day: mapTwelveStage(result.twelveStages.day),
    hour: mapTwelveStage(result.twelveStages.hour),
  };

  // Sinsals grouped by pillar position
  const sinsalsByPosition = mapSinsalsByPosition(result.sinsals);

  return {
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
    },
    dayMaster: {
      stem: dayStem,
      stemKr: STEM_KR[dayStem] ?? dayStem,
      element: dayMasterElement,
      elementKr: ELEMENT_KR[dayMasterElement] ?? dayMasterElement,
      polarity: dayMasterPolarity,
      polarityKr: POLARITY_KR[dayMasterPolarity] ?? dayMasterPolarity,
    },
    tenGods: {
      year: mapPillarTenGods(result.tenGods.year),
      month: mapPillarTenGods(result.tenGods.month),
      day: mapPillarTenGods(result.tenGods.day),
      hour: mapPillarTenGods(result.tenGods.hour),
      dayMaster: result.tenGods.dayMaster,
      counts: Object.fromEntries(
        Object.entries(countTenGodsFromResult(result)).filter(([, v]) => v > 0)
      ),
    },
    twelveStages,
    sinsalsByPosition,
    strength: {
      level: result.strength?.level?.key ?? "unknown",
      levelKr: result.strength?.level?.korean ?? "미상",
      score: result.strength?.score ?? 50,
      description: result.strength?.description ?? "",
    },
    yongShen: {
      primary: {
        element: result.yongShen?.primary?.key ?? "unknown",
        korean: result.yongShen?.primary?.korean ?? "미상",
        hanja: result.yongShen?.primary?.hanja ?? "未詳",
      },
      secondary: result.yongShen?.secondary
        ? {
            element: result.yongShen.secondary.key ?? "unknown",
            korean: result.yongShen.secondary.korean ?? "미상",
            hanja: result.yongShen.secondary.hanja ?? "未詳",
          }
        : null,
      method: result.yongShen?.method?.korean ?? "미상",
      reasoning: result.yongShen?.reasoning ?? "",
      recommendations,
    },
    elementBalance: elementCounts,
    majorLuck: {
      isForward: result.majorLuck.isForward,
      startAge: result.majorLuck.startAge,
      pillars: result.majorLuck.pillars.map((p) => ({
        index: p.index,
        startAge: p.startAge,
        endAge: p.endAge,
        pillar: p.pillar,
      })),
      current: currentMajorLuck
        ? {
            pillar: currentMajorLuck.pillar,
            startAge: currentMajorLuck.startAge,
            endAge: currentMajorLuck.endAge,
          }
        : null,
    },
    yearlyLuck: result.yearlyLuck.map((yl) => ({
      year: yl.year,
      pillar: yl.pillar,
      age: yl.age,
    })),
    relations: {
      stemCombinations: (result.relations?.combinations ?? [])
        .filter((c) => "pair" in c && c.type?.key === "stemCombination")
        .map((c) => ("pair" in c ? `${(c as { pair: string[] }).pair.join("+")} → ${c.resultElement?.korean ?? ""}` : "")),
      branchCombinations: (result.relations?.combinations ?? [])
        .filter((c) => c.type?.key !== "stemCombination")
        .map((c) => `${c.type?.korean ?? "합"}: ${"pair" in c ? (c as { pair: string[] }).pair.join("+") : "branches" in c ? (c as { branches: string[] }).branches.join("+") : ""}`),
      clashes: [
        ...(result.relations?.stemClashes ?? []).map((c) => `천간충: ${c.pair.join("↔")}`),
        ...(result.relations?.clashes ?? []).map((c) => `지지충: ${c.pair.join("↔")}`),
      ],
      punishments: (result.relations?.punishments ?? []).map(
        (p) => `${p.punishmentType?.korean ?? "형"}: ${p.branches.join("+")}`
      ),
      harms: (result.relations?.harms ?? []).map((h) => `지지해: ${h.pair.join("↔")}`),
    },
    sinsals: (result.sinsals?.matches ?? []).map((s) => ({
      key: s.sinsal?.key ?? "unknown",
      label: s.sinsal?.korean ?? "미상",
    })),
    lunar: {
      year: result.lunar?.lunarYear ?? input.birthYear,
      month: result.lunar?.lunarMonth ?? input.birthMonth,
      day: result.lunar?.lunarDay ?? input.birthDay,
      isLeapMonth: result.lunar?.isLeapMonth ?? false,
    },
  };
}

// ─── Helper functions ───

function getStemElement(stem: string): string {
  const map: Record<string, string> = {
    "甲": "wood", "乙": "wood", "丙": "fire", "丁": "fire", "戊": "earth",
    "己": "earth", "庚": "metal", "辛": "metal", "壬": "water", "癸": "water",
  };
  return map[stem] ?? "unknown";
}

function getStemPolarity(stem: string): string {
  const yang = ["甲", "丙", "戊", "庚", "壬"];
  return yang.includes(stem) ? "yang" : "yin";
}

function countElementsFromPillars(result: SajuResult): { wood: number; fire: number; earth: number; metal: number; water: number } {
  const counts: { wood: number; fire: number; earth: number; metal: number; water: number } = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const allStems = [
    result.pillars.year[0], result.pillars.month[0],
    result.pillars.day[0], result.pillars.hour[0],
  ];
  const allBranches = [
    result.pillars.year[1], result.pillars.month[1],
    result.pillars.day[1], result.pillars.hour[1],
  ];

  const elementKeys = ["wood", "fire", "earth", "metal", "water"] as const;

  for (const stem of allStems) {
    const el = getStemElement(stem) as typeof elementKeys[number];
    if (el in counts) counts[el]++;
  }

  // Branch elements (본기 only for simplicity — main element)
  const branchElement: Record<string, typeof elementKeys[number]> = {
    "子": "water", "丑": "earth", "寅": "wood", "卯": "wood",
    "辰": "earth", "巳": "fire", "午": "fire", "未": "earth",
    "申": "metal", "酉": "metal", "戌": "earth", "亥": "water",
  };
  for (const branch of allBranches) {
    const el = branchElement[branch];
    if (el) counts[el]++;
  }

  // Normalize to 0-100 scale (max possible = 8 slots)
  const total = elementKeys.reduce((a, k) => a + counts[k], 0);
  if (total > 0) {
    for (const key of elementKeys) {
      counts[key] = Math.round((counts[key] / total) * 100);
    }
  }
  return counts;
}

function countTenGodsFromResult(result: SajuResult): Record<string, number> {
  const counts: Record<string, number> = {};
  const pillars = [result.tenGods?.year, result.tenGods?.month, result.tenGods?.hour].filter(Boolean);
  for (const p of pillars) {
    const stemKey = p?.stem?.tenGod?.key;
    if (stemKey) counts[stemKey] = (counts[stemKey] ?? 0) + 1;
    const branchKey = p?.branch?.tenGod?.key;
    if (branchKey) counts[branchKey] = (counts[branchKey] ?? 0) + 1;
  }
  // Day branch only (day stem is dayMaster)
  const dayBranchKey = result.tenGods?.day?.branch?.tenGod?.key;
  if (dayBranchKey) counts[dayBranchKey] = (counts[dayBranchKey] ?? 0) + 1;
  return counts;
}

export { lookupLongitude };
