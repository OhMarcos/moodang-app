export interface FeatureAnalysis {
  /** 감지된 유형 e.g. "넓고 둥근 이마" */
  type: string;
  /** 관상학적 해석 */
  description: string;
  /** 1-5 scale */
  rating: number;
}

export interface FortuneReading {
  /** 1-100 score */
  score: number;
  /** 한 줄 요약 */
  summary: string;
  /** 상세 해석 */
  detail: string;
  /** 조언 */
  advice: string;
}

export interface HarshTruths {
  /** 불편한 진실 3가지 */
  truths: string[];
  /** 가장 주의해야 할 경고 한마디 */
  warning: string;
}

export interface FunTags {
  /** 색기/매력 지수 (1-100) */
  charmScore: number;
  /** 매력 해석 */
  charmDescription: string;
  /** 숨은 매력 포인트 */
  hiddenCharm: string;
  /** 이성 복/배우자 복 */
  romanticFortune: string;
  /** 조선시대 전생 직업 */
  pastLifeJob: string;
  /** 관상 한 줄 별명 */
  nickname: string;
  /** 숨은 재능 */
  hiddenTalent: string;
}

export interface ViralScores {
  /** 색기 지수 (1-100) */
  sexAppeal: number;
  /** 총기 지수 (1-100) */
  sharpMind: number;
  /** 재력 잠재력 (1-100) */
  wealthPotential: number;
  /** 인복 지수 (1-100) */
  peopleLuck: number;
  /** 관종력 (1-100) */
  mainCharacterEnergy: number;
}

export interface GwansangReading {
  /** 전체 인상 */
  overallImpression: string;
  /** 감지된 얼굴형 */
  faceShape: string;
  /** 개별 이목구비 분석 */
  features: {
    forehead: FeatureAnalysis;
    eyebrows: FeatureAnalysis;
    eyes: FeatureAnalysis;
    nose: FeatureAnalysis;
    mouth: FeatureAnalysis;
    ears: FeatureAnalysis;
    chin: FeatureAnalysis;
  };
  /** 운세 분석 */
  fortunes: {
    wealth: FortuneReading;
    love: FortuneReading;
    career: FortuneReading;
    health: FortuneReading;
    relationships: FortuneReading;
  };
  /** 인생 조언 */
  lifeAdvice: string;
  /** 행운의 요소 */
  luckyElements: {
    color: string;
    number: number;
    direction: string;
  };
  /** 바이럴 점수 5종 */
  viralScores: ViralScores;
  /** 재미/바이럴 요소 */
  funTags?: FunTags;
  /** 불편한 진실 */
  harshTruths?: HarshTruths;
}

export interface AnalysisState {
  status: "idle" | "capturing" | "analyzing" | "complete" | "error";
  imageData: string | null;
  reading: GwansangReading | null;
  error: string | null;
}
