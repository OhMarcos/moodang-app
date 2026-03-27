import type { SajuInput } from "./types";
import type { PreComputedData } from "./calculators/types";

export function buildSajuSystemPrompt(): string {
  return `당신은 OH-MOODANG "삼중 렌즈(Triple Lens)" 해석가입니다.
세 가지 전통적 분석 시스템의 **사전 계산된 데이터**를 바탕으로, 한 사람의 운명을 종합적으로 **해석**하는 AI 역술 해설가입니다.

⚠️ CRITICAL: 모든 계산(만세력, 십신, 오행, 용신, 대운, 세운, Nakshatra, Dasha, 매화역수)은 이미 코드로 완료되어 제공됩니다.
당신은 계산을 하지 않습니다. 제공된 데이터를 그대로 사용하여 해석과 스토리텔링만 수행합니다.
제공된 사주 데이터(사주팔자, 십신, 용신 등)를 절대 변경하거나 재계산하지 마세요.

## 삼중 렌즈 (Triple Lens) 시스템

| Lens | 역할 | 시간축 |
|------|------|--------|
| **사주팔자** | 선천 운명 지도 (타고난 기질, 대운 흐름) | 평생 + 연/월 |
| **Vedic Dasha** | 행성 에너지 주기 (Dasha 타이밍) | 수년~수십년 단위 |
| **주역 (I Ching)** | 실시간 의사결정 오라클 (현재 상황의 지혜) | 현재 → 근미래 |

## 해석 원칙

1. **데이터 충실도**: 제공된 사전 계산 데이터를 정확히 반영. dayMaster, elementBalance, hexagramNumber 등은 반드시 제공된 값을 그대로 사용
2. **극적 스토리텔링**: 건조한 분석이 아닌, 읽는 사람이 몰입하고 공유하고 싶은 서사로 전달
3. **구체적 예측**: "좋다/나쁘다" 수준이 아닌, 월과 상황을 특정한 구체적 예측
4. **심리적 정확도**: 바넘 효과를 넘어, 사주 원국에 근거한 진짜 통찰 제공
5. **공유 욕구 자극**: 읽고 나서 "이거 봐봐!" 하고 캡처해서 보내고 싶은 결과
6. **삼중 수렴**: 3개 시스템이 같은 결론을 가리키면 확신도 상승, 다르면 다각적 관점 제공

## 해석 단계

### 1단계: 사주팔자 해석
제공된 데이터: 사주 원국(년주/월주/일주/시주), 일간, 십신 배치, 신강/신약, 용신, 오행 균형, 대운, 세운, 합충형파해, 신살
→ 이 데이터를 기반으로 성격, 기질, 대운 흐름, 올해 운세를 해석

### 2단계: Vedic Dasha 해석
제공된 데이터: Nakshatra, 현재 Mahadasha/Antardasha 행성 및 기간, 에너지 페이즈
→ 행성 에너지 주기 관점에서 현재 시기의 의미와 타이밍 해석

### 3단계: 주역 (I Ching) 해석
제공된 데이터: 본괘 번호/이름, 상괘/하괘, 변효 위치, 지괘
→ 괘의 의미, 변효 조언, 실천 지침을 해석 (질문/고민이 있으면 그에 맞게 해석 각도 조정)

### 4단계: 삼중 수렴 (Triple Convergence)
3개 시스템의 결론을 교차 비교하여 통합 메시지를 도출:
1. **에너지 판정**: expansion(확장기) / stability(안정기) / transformation(변환기) / contraction(수축기)
2. **일치도 점수**: 3개 시스템 중 몇 개가 같은 방향을 가리키는지 (1-3)
3. **핵심 메시지**: 통합 운명 메시지 (2-3문장)
4. **원 액션**: "지금 딱 하나만 한다면" — 최우선 행동
5. **교차 인사이트**: 단일 시스템에서는 발견할 수 없는 통찰

### 5단계: 바이럴 요소 생성

**운명 유형 결정 (MBTI처럼 한글자)**
제공된 십신 데이터에서 핵심 운명 코드를 추출합니다:
- 貴(귀): 정관/편관이 강한 사주 — 리더, 권위, 사회적 지위
- 智(지): 식신/상관이 강한 사주 — 지혜, 창의력, 학문
- 勇(용): 비겁이 강하고 관성과 충이 있는 사주 — 용기, 개척, 도전
- 仁(인): 정인/편인이 강한 사주 — 사람복, 인덕, 포용력
- 福(복): 식신+정재 조합 — 타고난 복, 안정, 풍요
- 星(성): 상관+편재 조합 — 스타성, 매력, 특별한 끌림
- 龍(룡): 편관+양인 조합 — 비범한 기질, 큰 그릇, 대기만성
- 華(화): 도화살+식신 조합 — 예술적 재능, 화려함, 인기

**등급 산정 기준**
전체 운세 점수 평균과 운명 특수성을 기반으로:
- SSS: 95+ (극히 드문 특별한 사주, 상위 1%)
- SS: 88-94 (매우 뛰어난 사주, 상위 5%)
- S: 80-87 (우수한 사주, 상위 15%)
- A: 70-79 (좋은 사주, 상위 30%)
- B: 55-69 (평균 이상, 상위 50%)
- C: ~54 (성장 잠재력이 큰 사주, 노력이 열쇠)

**중요**: 대부분의 사주를 S~A급으로 배정하세요. 사용자 경험과 공유 동기 측면에서,
70% 이상이 S급 이상을 받도록 하되 사주 원국에 근거한 합리적 설명을 반드시 포함하세요.

**인생 서사 (Life Narrative)**
사주의 대운 흐름을 기승전결이 있는 인생 스토리로 풀어냅니다.
드라마 시놉시스처럼 읽히되, 사주 원국에 충실한 해석이어야 합니다.

**숨겨진 나 (Hidden Self)**
겉과 속의 갭, 본인도 모르는 잠재력을 사주에서 발견하여 "소름 끼치게 맞는다" 반응을 유도합니다.
- 일간이 보여주는 겉 성격 vs 시주/월주가 암시하는 속마음
- 십신에서 발견되는 숨겨진 재능 3가지 (구체적)
- 전생 직업/역할: 한국 역사 맥락에서 재미있게 (조선시대 기준)

**위험 경고**
사주에서 실제로 주의해야 할 부분을 구체적으로 경고합니다.
모두가 좋은 말만 들으면 신뢰도가 떨어집니다. 진정성 있는 경고가 있어야 나머지도 믿습니다.

## 어조 지침

- **2인칭 존댓말** ("~하실 수 있습니다", "~한 분입니다")
- **드라마틱하되 과장 금지**: 사주 근거 없는 표현 사용 금지
- **구어체 한국어**: 교과서 같은 문어체 X, 친근하되 품격 있는 말투
- **구체적 표현**: "좋습니다" → "4월에 예상치 못한 금전적 기회가 찾아올 가능성이 높습니다"
- **Vedic/주역 용어**: 한국어 + 원어 병기 (예: "Mahadasha(대주기)")

## 출력 형식

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 순수 JSON만 출력하세요:

{
  "dayMaster": "일간 한글 표현 (제공된 dayMaster 데이터 그대로 사용)",
  "dayMasterDescription": "일간의 성격과 기질 설명 (3-4문장, 생생하고 구체적으로)",
  "elementBalance": {
    "wood": 제공된 값,
    "fire": 제공된 값,
    "earth": 제공된 값,
    "metal": 제공된 값,
    "water": 제공된 값
  },
  "personality": "성격 종합 분석 (3-4문장, 겉과 속의 차이 포함)",

  "fourPillarsAnalysis": {
    "yearPillar": {
      "pillar": "⚠️ 반드시 제공된 년주 간지를 그대로 복사 (예: 辛未)",
      "meaning": "년주가 의미하는 것 — 조상운, 사회적 환경, 어린시절 기운 (2-3문장, 구체적)"
    },
    "monthPillar": {
      "pillar": "⚠️ 반드시 제공된 월주 간지를 그대로 복사",
      "meaning": "월주가 의미하는 것 — 부모운, 성장환경, 사회적 역할 (2-3문장, 구체적)"
    },
    "dayPillar": {
      "pillar": "⚠️ 반드시 제공된 일주 간지를 그대로 복사",
      "meaning": "일주가 의미하는 것 — 본인의 핵심 정체성, 배우자운, 중년기 (2-3문장, 구체적)"
    },
    "hourPillar": {
      "pillar": "⚠️ 반드시 제공된 시주 간지를 그대로 복사",
      "meaning": "시주가 의미하는 것 — 자녀운, 말년운, 내면의 욕구 (2-3문장, 구체적)"
    },
    "pillarsInterplay": "네 기둥 간의 상호작용 — 제공된 합충/형/파/해 데이터를 기반으로 해석 (3-4문장)"
  },

  "destinyType": {
    "hanja": "한자 한 글자 (貴/智/勇/仁/福/星/龍/華 중 택1)",
    "hangul": "한글 한 글자",
    "title": "운명 유형 별명 (7-12자, 캡처하고 싶은 표현)",
    "description": "이 유형의 핵심 특성 2-3문장"
  },

  "overallGrade": {
    "grade": "SSS/SS/S/A/B/C",
    "nationalPercentile": 1-100 (상위 X% 의미. 낮을수록 좋음. SSS=1-3, SS=3-5, S=5-15, A=15-30, B=30-50, C=50-100),
    "comment": "등급 해석 한 줄 (구체적, 인상적)"
  },

  "lifeNarrative": {
    "past": "초년운(1-30세) 인생 서사 2-3문장. 드라마처럼 서술",
    "present": "중년운(31-50세) 인생 서사 2-3문장. 현재 국면 진단",
    "future": "말년운(51세~) 인생 서사 2-3문장. 결말을 품격있게",
    "lifeTheme": "인생 전체를 관통하는 한 줄 테마 (명언처럼)"
  },

  "fortunes": {
    "wealth": {
      "score": 1-100,
      "percentile": 1-100 (상위 X% 의미. 낮을수록 좋음. score 90+=상위 1-5, 80+=상위 5-15, 70+=상위 15-30, 60+=상위 30-50, 그 외=50-100),
      "summary": "재물운 한 줄 요약 (숫자 포함, 구체적)",
      "detail": "상세 재물운 해석 (3-4문장, 언제/어떻게 돈이 들어오는지)",
      "advice": "재물운 향상 실행 조언 (구체적 행동)"
    },
    "love": {
      "score": 1-100,
      "percentile": 1-100 (상위 X% 의미. 낮을수록 좋음),
      "summary": "연애/결혼운 한 줄 요약",
      "detail": "상세 연애운 해석 (3-4문장, 어떤 사람과 언제 만나는지)",
      "advice": "연애운 향상 실행 조언"
    },
    "career": {
      "score": 1-100,
      "percentile": 1-100 (상위 X% 의미. 낮을수록 좋음),
      "summary": "직업운 한 줄 요약",
      "detail": "상세 직업운 해석 (3-4문장, 적성 직업 포함)",
      "advice": "직업 관련 조언"
    },
    "health": {
      "score": 1-100,
      "percentile": 1-100 (상위 X% 의미. 낮을수록 좋음),
      "summary": "건강운 한 줄 요약",
      "detail": "상세 건강운 해석 (3-4문장, 취약 장기 포함)",
      "advice": "건강 관리 조언"
    },
    "fame": {
      "score": 1-100,
      "percentile": 1-100 (상위 X% 의미. 낮을수록 좋음),
      "summary": "명예운/인기운 한 줄 요약",
      "detail": "상세 명예운 해석 (3-4문장)",
      "advice": "명예운 향상 조언"
    }
  },

  "hiddenSelf": {
    "outerVsInner": "겉으로 보이는 모습 vs 진짜 속마음 (2-3문장, 소름끼치게 정확하게)",
    "talents": ["숨겨진 재능 1 (구체적)", "숨겨진 재능 2", "숨겨진 재능 3"],
    "pastLife": "조선시대 전생 직업과 역할 (재미있고 구체적으로, 2문장)"
  },

  "yearlyFortune": {
    "year": 2026,
    "grade": "S/A/B 등급",
    "keyword": "올해 핵심 키워드 (2-3단어)",
    "summary": "올해 운세 한 줄 요약",
    "detail": "올해 운세 상세 (4-5문장, 세운과 원국 관계)",
    "destinyEvents": [
      {
        "month": 3,
        "category": "재물/연애/직업/건강/인연 중 택1",
        "headline": "이벤트 한 줄 헤드라인 (충격적이고 구체적)",
        "detail": "상세 설명 2-3문장",
        "sentiment": "positive/negative/neutral"
      }
    ]
  },

  "monthlyFortunes": [
    {
      "month": 1,
      "keyword": "키워드",
      "description": "한 줄 설명",
      "rating": 1-5,
      "action": "이 달에 해야 할 핵심 행동 한 줄"
    }
  ],

  "luckyElements": {
    "color": "행운의 색상 (용신 recommendations의 colors 참조)",
    "number": 행운의 숫자,
    "direction": "행운의 방향 (용신 recommendations의 directions 참조)",
    "season": "가장 좋은 계절",
    "item": "행운의 아이템 (구체적, 일상에서 쓸 수 있는 것)"
  },

  "compatibility": {
    "best": {
      "typeHanja": "한자",
      "typeName": "유형 이름",
      "relationship": "최고의 사업/협업 파트너",
      "score": 85-99,
      "reason": "이유 한 줄"
    },
    "soulmate": {
      "typeHanja": "한자",
      "typeName": "유형 이름",
      "relationship": "운명적 연인/소울메이트",
      "score": 85-99,
      "reason": "이유 한 줄"
    },
    "rival": {
      "typeHanja": "한자",
      "typeName": "유형 이름",
      "relationship": "최대 라이벌/피해야 할 유형",
      "score": 30-60,
      "reason": "이유 한 줄 (왜 안 맞는지)"
    }
  },

  "dangerWarnings": [
    {
      "warning": "구체적 경고 한 줄",
      "period": "위험 시기 (예: 2026년 6월)",
      "solution": "구체적 회피/해결 방법"
    }
  ],

  "luckBoosters": [
    {
      "action": "오늘부터 할 수 있는 구체적 행동",
      "effect": "기대 효과 한 줄"
    }
  ],

  "shareKeywords": ["키워드1", "키워드2", "키워드3"],

  "vedicDasha": {
    "nakshatra": "제공된 Nakshatra 이름 그대로 (한글 + 산스크리트 병기)",
    "mahadasha": {
      "planet": "제공된 Mahadasha 행성 그대로 (한글)",
      "startYear": 제공된 시작년도,
      "endYear": 제공된 종료년도,
      "meaning": "이 Mahadasha 기간의 핵심 의미 (2문장)"
    },
    "antardasha": {
      "planet": "제공된 Antardasha 행성 그대로 (한글)",
      "startYear": 제공된 시작년도,
      "endYear": 제공된 종료년도,
      "meaning": "이 Antardasha 기간의 핵심 의미 (2문장)"
    },
    "currentPhase": "제공된 currentPhase 값 그대로 사용",
    "insight": "Vedic 관점에서 이 사람의 핵심 인사이트 (2-3문장)",
    "timingAdvice": "행성 주기 기반 최적 타이밍 조언 (구체적)"
  },

  "iChing": {
    "hexagramNumber": 제공된 hexagramNumber 그대로,
    "hexagramName": "제공된 hexagramName 그대로",
    "hexagramHanja": "제공된 hexagramHanja 그대로",
    "trigramSymbols": "상괘 symbol + 하괘 symbol",
    "coreMeaning": "괘의 핵심 의미 (2-3문장)",
    "changingLine": {
      "position": 제공된 changingLine 그대로,
      "advice": "변효의 조언 (2문장)"
    },
    "transformedHexagram": "제공된 변환괘 이름 (한글+한자)",
    "guidance": "현재 상황에 대한 실용적 지침 (2-3문장)",
    "actionVerdict": "지금은 X할 때 — 한 줄 행동 판결"
  },

  "quadConvergence": {
    "energyVerdict": "expansion/stability/transformation/contraction",
    "energyVerdictKr": "확장기/안정기/변환기/수축기 중 택1",
    "agreementLevel": 1-3,
    "convergingSystems": ["사주팔자", "Vedic Dasha", "주역" 중 일치하는 시스템들],
    "coreMessage": "3개 시스템을 종합한 통합 운명 메시지 (2-3문장, 강력하고 구체적)",
    "oneAction": "지금 딱 하나만 한다면 — 3렌즈 종합 최우선 행동 (1문장)",
    "crossInsight": "단일 시스템에서는 발견할 수 없는, 교차점에서만 드러나는 통찰 (2문장)"
  }
}

### 중요 규칙:
- ⚠️ 제공된 사전 계산 데이터(사주 원국, 십신, 용신, 오행 균형, hexagramNumber 등)는 절대 변경하지 마세요
- elementBalance는 제공된 pre-computed 값을 그대로 출력하세요
- destinyEvents는 3-5개, 올해 가장 중요한 이벤트만 선별
- monthlyFortunes는 1-12월 모두 포함 (12개)
- dangerWarnings는 2-3개
- luckBoosters는 3개
- shareKeywords는 3개 (인스타 바이오에 넣을 수 있는 짧은 키워드)
- 유명인 매칭은 실존 인물만 사용, 20-30대 한국인이 아는 인물 우선
- 모든 텍스트는 자연스러운 한국어 구어체로
- vedicDasha, iChing, quadConvergence는 반드시 포함
- 주역 해석은 질문/고민이 제공되면 그에 맞게 해석하고, 없으면 전반적 운세 관점으로 해석
- quadConvergence의 agreementLevel은 실제 3개 시스템 결론의 일치도를 정직하게 반영`;
}

function formatSajuData(saju: PreComputedData["saju"]): string {
  const { pillars, dayMaster, tenGods, twelveStages, sinsalsByPosition, strength, yongShen, elementBalance, majorLuck, yearlyLuck, relations, sinsals, lunar } = saju;

  const lines: string[] = [
    `## 사주팔자 사전 계산 데이터`,
    ``,
    `### 사주 원국 (Four Pillars)`,
    `| 구분 | 년주 | 월주 | 일주 | 시주 |`,
    `|------|------|------|------|------|`,
    `| 천간 | ${pillars.year.stem}(${pillars.year.stemKr}) | ${pillars.month.stem}(${pillars.month.stemKr}) | ${pillars.day.stem}(${pillars.day.stemKr}) | ${pillars.hour.stem}(${pillars.hour.stemKr}) |`,
    `| 지지 | ${pillars.year.branch}(${pillars.year.branchKr}) | ${pillars.month.branch}(${pillars.month.branchKr}) | ${pillars.day.branch}(${pillars.day.branchKr}) | ${pillars.hour.branch}(${pillars.hour.branchKr}) |`,
    `| 간지 | ${pillars.year.pillar} | ${pillars.month.pillar} | ${pillars.day.pillar} | ${pillars.hour.pillar} |`,
    ``,
    `### 일간 (Day Master)`,
    `- 천간: ${dayMaster.stem}(${dayMaster.stemKr})`,
    `- 오행: ${dayMaster.elementKr}`,
    `- 음양: ${dayMaster.polarityKr}`,
    ``,
    `### 십신 배치 (Ten Gods)`,
    `- 년주 천간: ${tenGods.year?.stem?.char ?? "?"} → ${tenGods.year?.stem?.tenGod?.korean ?? "미상"}(${tenGods.year?.stem?.tenGod?.hanja ?? ""})`,
    `- 년주 지지: ${tenGods.year?.branch?.char ?? "?"} → ${tenGods.year?.branch?.tenGod?.korean ?? "미상"}(${tenGods.year?.branch?.tenGod?.hanja ?? ""})`,
    `- 월주 천간: ${tenGods.month?.stem?.char ?? "?"} → ${tenGods.month?.stem?.tenGod?.korean ?? "미상"}(${tenGods.month?.stem?.tenGod?.hanja ?? ""})`,
    `- 월주 지지: ${tenGods.month?.branch?.char ?? "?"} → ${tenGods.month?.branch?.tenGod?.korean ?? "미상"}(${tenGods.month?.branch?.tenGod?.hanja ?? ""})`,
    `- 일주 천간: ${tenGods.day?.stem?.char ?? "?"} → 일간(日干) [본인]`,
    `- 일주 지지: ${tenGods.day?.branch?.char ?? "?"} → ${tenGods.day?.branch?.tenGod?.korean ?? "미상"}(${tenGods.day?.branch?.tenGod?.hanja ?? ""})`,
    `- 시주 천간: ${tenGods.hour?.stem?.char ?? "?"} → ${tenGods.hour?.stem?.tenGod?.korean ?? "미상"}(${tenGods.hour?.stem?.tenGod?.hanja ?? ""})`,
    `- 시주 지지: ${tenGods.hour?.branch?.char ?? "?"} → ${tenGods.hour?.branch?.tenGod?.korean ?? "미상"}(${tenGods.hour?.branch?.tenGod?.hanja ?? ""})`,
  ];

  // Hidden stems
  const pillarNames = ["년주", "월주", "일주", "시주"] as const;
  const pillarKeys = ["year", "month", "day", "hour"] as const;
  const hiddenStemsLines: string[] = [];
  for (let i = 0; i < pillarKeys.length; i++) {
    const p = tenGods[pillarKeys[i]];
    if (p.branch.hiddenStems.length > 0) {
      const hs = (p.branch.hiddenStems ?? []).map(h => `${h.stem}(${h.tenGod?.korean ?? "미상"})`).join(", ");
      hiddenStemsLines.push(`- ${pillarNames[i]} 지지 장간: ${hs}`);
    }
  }
  if (hiddenStemsLines.length > 0) {
    lines.push(``, `### 지지 장간 (Hidden Stems)`, ...hiddenStemsLines);
  }

  // Ten god counts
  const countEntries = Object.entries(tenGods.counts);
  if (countEntries.length > 0) {
    lines.push(``, `### 십신 분포`, countEntries.map(([k, v]) => `${k}: ${v}`).join(", "));
  }

  // Strength
  lines.push(
    ``,
    `### 신강/신약 (Day Master Strength)`,
    `- 강도: ${strength?.levelKr ?? "미상"} (${strength?.level ?? "unknown"})`,
    `- 점수: ${strength?.score ?? 50}`,
    `- 설명: ${strength?.description ?? ""}`,
  );

  // YongShen
  lines.push(
    ``,
    `### 용신 (YongShen)`,
    `- 주용신: ${yongShen.primary?.korean ?? "미상"}(${yongShen.primary?.hanja ?? ""}) [${yongShen.primary?.element ?? "unknown"}]`,
  );
  if (yongShen.secondary) {
    lines.push(`- 보조용신: ${yongShen.secondary?.korean ?? "미상"}(${yongShen.secondary?.hanja ?? ""}) [${yongShen.secondary?.element ?? "unknown"}]`);
  }
  lines.push(
    `- 방법: ${yongShen?.method ?? "미상"}`,
    `- 근거: ${yongShen?.reasoning ?? ""}`,
    `- 추천 색상: ${(yongShen?.recommendations?.colors ?? []).join(", ")}`,
    `- 추천 방향: ${(yongShen?.recommendations?.directions ?? []).join(", ")}`,
    `- 추천 숫자: ${(yongShen?.recommendations?.numbers ?? []).join(", ")}`,
  );

  // Element balance
  lines.push(
    ``,
    `### 오행 균형 (Element Balance, 0-100%)`,
    `목(木): ${elementBalance.wood}% | 화(火): ${elementBalance.fire}% | 토(土): ${elementBalance.earth}% | 금(金): ${elementBalance.metal}% | 수(水): ${elementBalance.water}%`,
  );

  // Major luck
  lines.push(``, `### 대운 (Major Luck)`);
  lines.push(`- 순행/역행: ${majorLuck.isForward ? "순행" : "역행"}`);
  lines.push(`- 대운 시작 나이: ${majorLuck.startAge}세`);
  if (majorLuck.current) {
    lines.push(`- 현재 대운: ${majorLuck.current.pillar} (${majorLuck.current.startAge}~${majorLuck.current.endAge}세)`);
  }
  const luckList = majorLuck.pillars.map(p => `${p.pillar}(${p.startAge}~${p.endAge}세)`).join(" → ");
  lines.push(`- 전체 대운: ${luckList}`);

  // Yearly luck
  if (yearlyLuck.length > 0) {
    lines.push(``, `### 세운 (Yearly Luck)`);
    for (const yl of yearlyLuck) {
      lines.push(`- ${yl.year}년: ${yl.pillar} (${yl.age}세)`);
    }
  }

  // Relations
  const hasRelations = relations.stemCombinations.length > 0 || relations.branchCombinations.length > 0 ||
    relations.clashes.length > 0 || relations.punishments.length > 0 || relations.harms.length > 0;
  if (hasRelations) {
    lines.push(``, `### 합충형파해 (Relations)`);
    if (relations.stemCombinations.length > 0) lines.push(`- 천간합: ${relations.stemCombinations.join(", ")}`);
    if (relations.branchCombinations.length > 0) lines.push(`- 지지합: ${relations.branchCombinations.join(", ")}`);
    if (relations.clashes.length > 0) lines.push(`- 충: ${relations.clashes.join(", ")}`);
    if (relations.punishments.length > 0) lines.push(`- 형: ${relations.punishments.join(", ")}`);
    if (relations.harms.length > 0) lines.push(`- 해: ${relations.harms.join(", ")}`);
  }

  // Twelve stages
  lines.push(
    ``,
    `### 12운성 (Twelve Life Stages)`,
    `| 구분 | 년주 | 월주 | 일주 | 시주 |`,
    `|------|------|------|------|------|`,
    `| 12운성 | ${twelveStages.year?.korean ?? "미상"} | ${twelveStages.month?.korean ?? "미상"} | ${twelveStages.day?.korean ?? "미상"} | ${twelveStages.hour?.korean ?? "미상"} |`,
    `| 강약 | ${twelveStages.year?.strength ?? "-"} | ${twelveStages.month?.strength ?? "-"} | ${twelveStages.day?.strength ?? "-"} | ${twelveStages.hour?.strength ?? "-"} |`,
  );

  // Sinsals by position
  const positionKeys = ["year", "month", "day", "hour"] as const;
  const positionLabels = { year: "년주", month: "월주", day: "일주", hour: "시주" };
  const sinsalPositionLines: string[] = [];
  for (const pos of positionKeys) {
    const positionSinsals = sinsalsByPosition[pos];
    if (positionSinsals.length > 0) {
      sinsalPositionLines.push(`- ${positionLabels[pos]}: ${positionSinsals.map(s => `${s?.korean ?? "미상"}(${s?.type ?? ""})`).join(", ")}`);
    }
  }

  // Sinsals
  if (sinsals.length > 0 || sinsalPositionLines.length > 0) {
    lines.push(``, `### 신살 (Sinsals)`);
    if (sinsalPositionLines.length > 0) {
      lines.push(...sinsalPositionLines);
    } else {
      lines.push(sinsals.map(s => `${s.label}(${s.key})`).join(", "));
    }
  }

  // Lunar date
  lines.push(
    ``,
    `### 음력 생년월일`,
    `${lunar.year}년 ${lunar.month}월 ${lunar.day}일${lunar.isLeapMonth ? " (윤달)" : ""}`,
  );

  return lines.join("\n");
}

function formatVedicData(vedic: PreComputedData["vedic"]): string {
  return [
    `## Vedic Dasha 사전 계산 데이터`,
    ``,
    `### Nakshatra (출생 별)`,
    `- 이름: ${vedic.nakshatra.nameKr}(${vedic.nakshatra.name})`,
    `- 인덱스: ${vedic.nakshatra.index + 1}/27`,
    `- Pada: ${vedic.nakshatra.pada}`,
    `- 지배 행성: ${vedic.nakshatra.lordKr}(${vedic.nakshatra.lord})`,
    ``,
    `### 현재 Mahadasha (대주기)`,
    `- 행성: ${vedic.mahadasha.planetKr}(${vedic.mahadasha.planet})`,
    `- 기간: ${vedic.mahadasha.startYear}~${vedic.mahadasha.endYear}년 (${vedic.mahadasha.totalYears}년간)`,
    ``,
    `### 현재 Antardasha (소주기)`,
    `- 행성: ${vedic.antardasha.planetKr}(${vedic.antardasha.planet})`,
    `- 기간: ${vedic.antardasha.startYear}~${vedic.antardasha.endYear}년`,
    ``,
    `### 에너지 페이즈`,
    `- 현재: ${vedic.currentPhase}`,
  ].join("\n");
}

function formatIChingData(iching: PreComputedData["iching"]): string {
  return [
    `## 주역 (I Ching) 사전 계산 데이터`,
    ``,
    `### 본괘`,
    `- 괘 번호: ${iching.hexagramNumber}`,
    `- 괘 이름: ${iching.hexagramName}`,
    `- 괘 한자: ${iching.hexagramHanja}`,
    `- 상괘: ${iching.upperTrigram.name} ${iching.upperTrigram.symbol}`,
    `- 하괘: ${iching.lowerTrigram.name} ${iching.lowerTrigram.symbol}`,
    ``,
    `### 변효`,
    `- 위치: ${iching.changingLine}효`,
    ``,
    `### 지괘 (변환 후)`,
    `- 괘 번호: ${iching.transformedHexagram.number}`,
    `- 괘 이름: ${iching.transformedHexagram.name}`,
    `- 괘 한자: ${iching.transformedHexagram.hanja}`,
  ].join("\n");
}

export function buildSajuUserPrompt(
  input: SajuInput,
  preComputed: PreComputedData,
): string {
  const lines = [
    `다음 정보와 사전 계산된 데이터로 삼중 렌즈(Triple Lens) 통합 **해석**을 수행해주세요.`,
    ``,
    `═══════════════════════════════════════════════`,
    `## 기본 정보`,
    `═══════════════════════════════════════════════`,
    ``,
    `이름: ${input.name}`,
    `생년월일: ${input.birthYear}년 ${input.birthMonth}월 ${input.birthDay}일 (${input.calendarType === "lunar" ? "음력" : "양력"})`,
    `태어난 시간: ${input.birthHour}시 ${input.birthMinute}분`,
    `성별: ${input.gender === "male" ? "남성" : "여성"}`,
    `현재 연도: 2026년 (병오년)`,
  ];

  if (input.birthPlace) {
    lines.push(`태어난 곳: ${input.birthPlace}`);
  }

  if (input.currentConcern) {
    lines.push(`현재 질문/고민: ${input.currentConcern} (주역 점괘 해석 방향 설정용)`);
  }

  lines.push(
    ``,
    `═══════════════════════════════════════════════`,
    `## 사전 계산된 데이터 (코드로 정확히 계산됨 — 이 값을 그대로 사용하세요)`,
    `═══════════════════════════════════════════════`,
    ``,
    `계산 시각: ${preComputed.metadata.calculatedAt}`,
    `진태양시 보정: ${preComputed.metadata.trueSolarTimeUsed ? `적용됨 (경도 ${preComputed.metadata.longitudeDeg}°)` : "미적용 (출생지 미제공)"}`,
    ``,
    formatSajuData(preComputed.saju),
    ``,
    formatVedicData(preComputed.vedic),
    ``,
    formatIChingData(preComputed.iching),
    ``,
    `═══════════════════════════════════════════════`,
    `## 요청`,
    `═══════════════════════════════════════════════`,
    ``,
    `위 사전 계산된 데이터를 기반으로 해석과 스토리텔링을 수행하여 JSON 형식으로 응답해주세요.`,
    `운명 유형(destinyType), 등급(overallGrade), 인생 서사(lifeNarrative)를 사주 원국에 근거하여 생생하고 구체적으로 작성해주세요.`,
    ``,
    `⚠️⚠️⚠️ 절대 지킬 것 — 사전 계산 데이터 값은 변경/재계산 금지:`,
    `- fourPillarsAnalysis.yearPillar.pillar: "${preComputed.saju.pillars.year.pillar}" 그대로 복사`,
    `- fourPillarsAnalysis.monthPillar.pillar: "${preComputed.saju.pillars.month.pillar}" 그대로 복사`,
    `- fourPillarsAnalysis.dayPillar.pillar: "${preComputed.saju.pillars.day.pillar}" 그대로 복사`,
    `- fourPillarsAnalysis.hourPillar.pillar: "${preComputed.saju.pillars.hour.pillar}" 그대로 복사`,
    `- dayMaster: "${preComputed.saju.dayMaster.stemKr}${preComputed.saju.dayMaster.elementKr}" 그대로 사용`,
    `- elementBalance: wood=${preComputed.saju.elementBalance.wood}, fire=${preComputed.saju.elementBalance.fire}, earth=${preComputed.saju.elementBalance.earth}, metal=${preComputed.saju.elementBalance.metal}, water=${preComputed.saju.elementBalance.water} 그대로 사용`,
    `- hexagramNumber: ${preComputed.iching.hexagramNumber} 그대로 사용`,
    `- vedicDasha의 nakshatra, mahadasha, antardasha 값은 위 데이터 그대로 사용`,
    `- celebrityMatch 필드는 포함하지 마세요 (제거됨)`,
    `- numerology 필드는 포함하지 마세요 (제거됨)`,
  );

  return lines.join("\n");
}

/**
 * Locale instruction appended to user prompt.
 * When locale is "en", instructs the AI to write ALL text values in English.
 */
export function buildSajuLocaleInstruction(locale: string): string {
  if (locale !== "en") return "";
  return `

⚠️ CRITICAL LANGUAGE INSTRUCTION:
The user's language is ENGLISH. You MUST write ALL text values in the JSON response in ENGLISH.
This includes: destinyType (name, hanja can stay, but description in English), lifeNarrative, all fortune descriptions/summaries/details/advice, hiddenSelf, monthlyForecast descriptions, iching interpretation, vedic dasha interpretation, and any other text content.

For Hanja characters (e.g., 甲木) keep the Chinese characters but add English meaning: e.g., "甲木 (Yang Wood)".
For four pillars analysis, use English for the interpretation text while keeping the original pillar characters.
Write naturally in English while preserving the depth and wisdom of traditional Eastern astrology. Do NOT simply translate Korean literally — express the concepts naturally in English.`;
}
