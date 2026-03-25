// ─── Pre-computed data types for all 4 calculation systems ───

export interface PillarData {
  stem: string;       // 천간 한자 (甲,乙,丙,丁...)
  branch: string;     // 지지 한자 (子,丑,寅,卯...)
  pillar: string;     // 간지 (甲子, 乙丑...)
  stemKr: string;     // 한글 (갑,을,병,정...)
  branchKr: string;   // 한글 (자,축,인,묘...)
}

export interface TenGodEntry {
  key: string;        // english key (companion, robWealth, etc.)
  korean: string;     // 한글 (비견, 겁재, 식신...)
  hanja: string;      // 한자 (比肩, 劫財, 食神...)
}

export interface PillarTenGods {
  stem: { char: string; tenGod: TenGodEntry };
  branch: {
    char: string;
    tenGod: TenGodEntry;
    hiddenStems: { stem: string; tenGod: TenGodEntry }[];
  };
}

export interface TwelveStageInfo {
  key: string;      // longLife, bathing, crownBelt, etc.
  korean: string;   // 장생, 목욕, 관대...
  hanja: string;    // 長生, 沐浴, 冠帶...
  meaning: string;  // description
  strength: "strong" | "neutral" | "weak";
}

export interface SinsalInfo {
  key: string;
  korean: string;
  hanja: string;
  meaning: string;
  type: "auspicious" | "inauspicious" | "neutral";
  position: string;   // year, month, day, hour
}

export interface PreComputedSaju {
  pillars: {
    year: PillarData;
    month: PillarData;
    day: PillarData;
    hour: PillarData;
  };
  dayMaster: {
    stem: string;
    stemKr: string;
    element: string;
    elementKr: string;
    polarity: string;
    polarityKr: string;
  };
  tenGods: {
    year: PillarTenGods;
    month: PillarTenGods;
    day: PillarTenGods;
    hour: PillarTenGods;
    dayMaster: string;
    counts: Record<string, number>;
  };
  twelveStages: {
    year: TwelveStageInfo;
    month: TwelveStageInfo;
    day: TwelveStageInfo;
    hour: TwelveStageInfo;
  };
  sinsalsByPosition: {
    year: SinsalInfo[];
    month: SinsalInfo[];
    day: SinsalInfo[];
    hour: SinsalInfo[];
  };
  strength: {
    level: string;
    levelKr: string;
    score: number;
    description: string;
  };
  yongShen: {
    primary: { element: string; korean: string; hanja: string };
    secondary: { element: string; korean: string; hanja: string } | null;
    method: string;
    reasoning: string;
    recommendations: { colors: string[]; directions: string[]; numbers: number[] };
  };
  elementBalance: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  majorLuck: {
    isForward: boolean;
    startAge: number;
    pillars: {
      index: number;
      startAge: number;
      endAge: number;
      pillar: string;
    }[];
    current: { pillar: string; startAge: number; endAge: number } | null;
  };
  yearlyLuck: {
    year: number;
    pillar: string;
    age: number;
  }[];
  relations: {
    stemCombinations: string[];
    branchCombinations: string[];
    clashes: string[];
    punishments: string[];
    harms: string[];
  };
  sinsals: { key: string; label: string }[];
  lunar: {
    year: number;
    month: number;
    day: number;
    isLeapMonth: boolean;
  };
}

export interface PreComputedVedic {
  nakshatra: {
    index: number;
    name: string;
    nameKr: string;
    pada: number;
    lord: string;
    lordKr: string;
    degrees: { start: number; end: number };
  };
  mahadasha: {
    planet: string;
    planetKr: string;
    startYear: number;
    endYear: number;
    totalYears: number;
  };
  antardasha: {
    planet: string;
    planetKr: string;
    startYear: number;
    endYear: number;
  };
  currentPhase: "expansion" | "stability" | "transformation" | "contraction";
}

export interface PreComputedIChing {
  hexagramNumber: number;
  hexagramName: string;
  hexagramHanja: string;
  upperTrigram: { index: number; name: string; symbol: string };
  lowerTrigram: { index: number; name: string; symbol: string };
  changingLine: number;
  transformedHexagram: {
    number: number;
    name: string;
    hanja: string;
  };
}

export interface PreComputedData {
  saju: PreComputedSaju;
  vedic: PreComputedVedic;
  iching: PreComputedIChing;
  metadata: {
    calculatedAt: string;
    trueSolarTimeUsed: boolean;
    longitudeDeg: number;
    /** Engines that fell back to defaults (e.g., ["vedic", "iching"]) */
    fallbacksUsed: string[];
    /** True if birth hour was unknown (-1) and defaulted to noon */
    birthHourUnknown: boolean;
  };
}
