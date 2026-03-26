export interface SajuInput {
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  gender: "male" | "female";
  calendarType: "solar" | "lunar";
  /** Optional birthplace for solar time correction & Vedic ascendant */
  birthPlace?: string;
  /** Optional current concern for I Ching reading */
  currentConcern?: string;
}

// --- Core Saju Analysis ---

export interface ElementBalance {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface FortuneCategory {
  score: number;
  percentile: number;
  summary: string;
  detail: string;
  advice: string;
}

// --- Viral / Shareable Sections ---

/** MBTI-style single-character destiny type */
export interface DestinyType {
  /** 한자 한 글자 (e.g. 貴, 智, 勇, 仁, 美, 福, 星, 龍) */
  hanja: string;
  /** 한글 한 글자 (e.g. 귀, 지, 용, 인, 미, 복, 성, 룡) */
  hangul: string;
  /** 운명 유형 별명 (e.g. "하늘이 선택한 귀인") */
  title: string;
  /** 유형 설명 2-3문장 */
  description: string;
}

/** SSS/SS/S/A/B/C grade like a game */
export interface OverallGrade {
  /** SSS, SS, S, A, B, C */
  grade: string;
  /** 전국 백분위 — 상위 X% (낮을수록 좋음, 1=상위1%) */
  nationalPercentile: number;
  /** 등급 한 줄 해석 */
  comment: string;
}

/** Celebrity/historical figure match */
export interface CelebrityMatch {
  /** 인물 이름 */
  name: string;
  /** 매칭 이유 한 줄 */
  reason: string;
  /** 유사도 % (70-95) */
  similarity: number;
}

/** Life narrative: past → present → future arc */
export interface LifeNarrative {
  /** 과거 (초년운) 2-3문장 */
  past: string;
  /** 현재 (중년운) 2-3문장 */
  present: string;
  /** 미래 (말년운) 2-3문장 */
  future: string;
  /** 인생 전체를 관통하는 핵심 테마 한 줄 */
  lifeTheme: string;
}

/** Hidden self — surprising traits */
export interface HiddenSelf {
  /** 숨겨진 성격 (겉 vs 속) */
  outerVsInner: string;
  /** 숨겨진 재능 3개 */
  talents: string[];
  /** 전생 직업/역할 (재미 요소) */
  pastLife: string;
}

/** Major destiny events for the year */
export interface DestinyEvent {
  /** 월 (1-12) */
  month: number;
  /** 이벤트 카테고리 (재물/연애/직업/건강/인연) */
  category: string;
  /** 한 줄 요약 */
  headline: string;
  /** 상세 설명 */
  detail: string;
  /** 긍정/부정/중립 */
  sentiment: "positive" | "negative" | "neutral";
}

/** Monthly fortune with visual rating */
export interface MonthlyFortune {
  month: number;
  keyword: string;
  description: string;
  rating: number;
  /** 핵심 행동 한 줄 */
  action: string;
}

/** Compatibility type for social comparison */
export interface CompatibilityType {
  /** 상대 운명 유형 (한자) */
  typeHanja: string;
  /** 유형 이름 */
  typeName: string;
  /** 관계 종류 (연인/사업파트너/친구) */
  relationship: string;
  /** 궁합 점수 */
  score: number;
  /** 이유 */
  reason: string;
}

/** Danger zone — specific warnings with urgency */
export interface DangerWarning {
  /** 경고 한 줄 */
  warning: string;
  /** 위험 시기 */
  period: string;
  /** 구체적 회피 방법 */
  solution: string;
}

/** Quick action items for luck boosting */
export interface LuckBooster {
  /** 액션 */
  action: string;
  /** 효과 설명 */
  effect: string;
}

// --- Triple Lens: Vedic Dasha ---

export interface VedicDasha {
  /** Current Nakshatra (birth star) */
  nakshatra: string;
  /** Current Mahadasha planet + period */
  mahadasha: { planet: string; startYear: number; endYear: number; meaning: string };
  /** Current Antardasha (sub-period) */
  antardasha: { planet: string; startYear: number; endYear: number; meaning: string };
  /** Current energy phase: expansion/stability/transformation/contraction */
  currentPhase: string;
  /** Key insight from Vedic perspective */
  insight: string;
  /** Best timing advice from planetary periods */
  timingAdvice: string;
}

// --- Triple Lens: I Ching ---

export interface IChingReading {
  /** Primary hexagram number (1-64) */
  hexagramNumber: number;
  /** Hexagram Korean name */
  hexagramName: string;
  /** Hexagram Chinese characters */
  hexagramHanja: string;
  /** Upper + lower trigram symbols (e.g. ☰ over ☵) */
  trigramSymbols: string;
  /** Core meaning of the hexagram */
  coreMeaning: string;
  /** Changing line position(s) and their advice */
  changingLine: { position: number; advice: string };
  /** Transformed hexagram name */
  transformedHexagram: string;
  /** Practical guidance for the current situation */
  guidance: string;
  /** "지금은 X할 때" style one-liner */
  actionVerdict: string;
}

// --- Triple Lens: Convergence ---

export interface QuadConvergence {
  /** Overall energy verdict: expansion/stability/transformation/contraction */
  energyVerdict: string;
  /** Korean label for verdict */
  energyVerdictKr: string;
  /** 3-system agreement level (1-3, how many systems agree) */
  agreementLevel: number;
  /** Systems that converge on same conclusion */
  convergingSystems: string[];
  /** Unified core message synthesizing all 3 systems */
  coreMessage: string;
  /** "The one thing to do now" — synthesized action from all 3 lenses */
  oneAction: string;
  /** Cross-system insight that no single system could reveal alone */
  crossInsight: string;
}

// --- Full Reading ---

/** Four Pillars analysis — AI interprets each pillar's role */
export interface FourPillarsAnalysis {
  yearPillar: { pillar: string; meaning: string };
  monthPillar: { pillar: string; meaning: string };
  dayPillar: { pillar: string; meaning: string };
  hourPillar: { pillar: string; meaning: string };
  pillarsInterplay: string;
}

/** Raw pillar data passed from pre-computed engine (not AI) */
export interface RawPillarInfo {
  year: { stem: string; stemKr: string; branch: string; branchKr: string; pillar: string };
  month: { stem: string; stemKr: string; branch: string; branchKr: string; pillar: string };
  day: { stem: string; stemKr: string; branch: string; branchKr: string; pillar: string };
  hour: { stem: string; stemKr: string; branch: string; branchKr: string; pillar: string };
}

export interface SajuReading {
  // Core Analysis
  dayMaster: string;
  dayMasterDescription: string;
  elementBalance: ElementBalance;
  personality: string;

  // Four Pillars Full Analysis
  fourPillarsAnalysis?: FourPillarsAnalysis;

  // Viral Hook: Destiny Type (MBTI-style)
  destinyType: DestinyType;

  // Viral Hook: Overall Grade (게임 등급)
  overallGrade: OverallGrade;

  // Viral Hook: Life Narrative (스토리텔링)
  lifeNarrative: LifeNarrative;

  // Fortune Scores with Percentile
  fortunes: {
    wealth: FortuneCategory;
    love: FortuneCategory;
    career: FortuneCategory;
    health: FortuneCategory;
    fame: FortuneCategory;
  };

  // Viral Hook: Celebrity Match
  celebrityMatch: {
    korean: CelebrityMatch;
    historical: CelebrityMatch;
    global: CelebrityMatch;
  };

  // Hidden Self (놀라움 유발)
  hiddenSelf: HiddenSelf;

  // 2026 Yearly Fortune
  yearlyFortune: {
    year: number;
    grade: string;
    keyword: string;
    summary: string;
    detail: string;
    destinyEvents: DestinyEvent[];
  };

  // Monthly Fortunes
  monthlyFortunes: MonthlyFortune[];

  // Lucky Elements
  luckyElements: {
    color: string;
    number: number;
    direction: string;
    season: string;
    item: string;
  };

  // Compatibility (궁합)
  compatibility: {
    best: CompatibilityType;
    soulmate: CompatibilityType;
    rival: CompatibilityType;
  };

  // Danger Zone (경고)
  dangerWarnings: DangerWarning[];

  // Luck Boosters (즉시 실행)
  luckBoosters: LuckBooster[];

  // Share Keywords (인스타 바이오용)
  shareKeywords: string[];

  // ─── Triple Lens (3-System Analysis) ───
  vedicDasha?: VedicDasha;
  iChing?: IChingReading;
  quadConvergence?: QuadConvergence;
}

export interface SajuAnalysisState {
  status: "idle" | "input" | "analyzing" | "complete" | "error";
  input: SajuInput | null;
  reading: SajuReading | null;
  error: string | null;
}
