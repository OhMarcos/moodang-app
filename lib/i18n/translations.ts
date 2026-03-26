export type Locale = "ko" | "en";

export const translations = {
  // ─── Layout / Footer ───
  "layout.disclaimer": {
    ko: "본 서비스는 전통 관상학과 사주명리학을 기반으로 한 재미용 콘텐츠입니다.",
    en: "This service is entertainment content based on traditional physiognomy and Saju astrology.",
  },

  // ─── Home Page ───
  "home.badge": { ko: "AI × 전통 동양학", en: "AI × Eastern Wisdom" },
  "home.subtitle": {
    ko: "당신의 얼굴과 사주가 말하는 것",
    en: "What your face and birth chart reveal",
  },
  "home.description": {
    ko: "전통 관상학과 사주팔자의 수백 년 지혜를 AI로 경험하세요",
    en: "Experience centuries of physiognomy and Saju wisdom through AI",
  },
  "home.gwansang.title": { ko: "AI 관상", en: "AI Physiognomy" },
  "home.gwansang.desc": {
    ko: "얼굴 사진 한 장으로 12궁, 삼정, 오관 전통 관상학 분석. 성격, 재물운, 애정운, 직업운까지.",
    en: "Traditional physiognomy analysis from a single photo. Personality, wealth, love, and career readings.",
  },
  "home.saju.title": { ko: "운명교차점", en: "Destiny Crossroads" },
  "home.saju.badge": { ko: "3-System", en: "3-System" },
  "home.saju.desc": {
    ko: "동서양 3대 운명학 교차분석. 사주·Vedic·주역이 한 목소리로 말하는 연애·재물·직업 에너지 리포트.",
    en: "Cross-analysis of 3 Eastern & Western destiny systems. Saju · Vedic · I Ching converge on love, wealth & career.",
  },
  "home.howItWorks": { ko: "이용 방법", en: "HOW IT WORKS" },
  "home.step1.title": { ko: "선택", en: "Choose" },
  "home.step1.desc": { ko: "관상 또는\n운명분석 선택", en: "Select physiognomy\nor destiny analysis" },
  "home.step2.title": { ko: "입력", en: "Input" },
  "home.step2.desc": { ko: "사진 촬영 또는\n생년월일시 입력", en: "Take a photo or\nenter birth details" },
  "home.step3.title": { ko: "결과", en: "Results" },
  "home.step3.desc": { ko: "AI 분석 리포트\n확인 & 공유", en: "View & share your\nAI analysis report" },
  "home.socialProof": { ko: "전통 동양학 기반 AI 분석 서비스", en: "AI analysis powered by Eastern traditions" },

  // ─── Saju Page: Header ───
  "saju.badge": { ko: "3-System Convergence", en: "3-System Convergence" },
  "saju.title": { ko: "운명교차점", en: "Destiny Crossroads" },
  "saju.subtitle": {
    ko: "사주, Vedic, 주역 세 가지 운명학을 통해 에너지와 운명을 분석합니다",
    en: "Analyzing your energy and destiny through Saju, Vedic, and I Ching",
  },

  // ─── Saju Page: Input Form ───
  "saju.form.name": { ko: "이름", en: "Name" },
  "saju.form.namePlaceholder": { ko: "이름을 입력하세요", en: "Enter your name" },
  "saju.form.calendar": { ko: "달력", en: "Calendar" },
  "saju.form.solar": { ko: "양력", en: "Solar" },
  "saju.form.lunar": { ko: "음력", en: "Lunar" },
  "saju.form.birthDate": { ko: "생년월일", en: "Date of Birth" },
  "saju.form.yearPlaceholder": { ko: "년 (1990)", en: "Year (1990)" },
  "saju.form.monthPlaceholder": { ko: "월", en: "Month" },
  "saju.form.dayPlaceholder": { ko: "일", en: "Day" },
  "saju.form.birthHour": { ko: "태어난 시간", en: "Birth Hour" },
  "saju.form.gender": { ko: "성별", en: "Gender" },
  "saju.form.male": { ko: "남성", en: "Male" },
  "saju.form.female": { ko: "여성", en: "Female" },
  "saju.form.optionalExpand": { ko: "더 정확한 분석을 원하시면 (선택)", en: "For more accurate analysis (optional)" },
  "saju.form.optionalCollapse": { ko: "접기", en: "Collapse" },
  "saju.form.birthPlace": { ko: "태어난 곳", en: "Birth Place" },
  "saju.form.birthPlaceHint": { ko: "(진태양시 보정 · Vedic 차트용)", en: "(True solar time · for Vedic chart)" },
  "saju.form.birthPlacePlaceholder": { ko: "예: 서울, 부산, Toronto", en: "e.g. Seoul, New York, Toronto" },
  "saju.form.concern": { ko: "현재 고민", en: "Current Concern" },
  "saju.form.concernHint": { ko: "(주역 점괘용)", en: "(for I Ching reading)" },
  "saju.form.concernPlaceholder": { ko: "예: 이직을 해야 할지 고민입니다", en: "e.g. Should I change jobs?" },
  "saju.form.submit": { ko: "운명 분석 시작하기", en: "Start Destiny Analysis" },
  "saju.form.retry": { ko: "다시 시도하기", en: "Try Again" },
  "saju.form.reset": { ko: "다시 하기", en: "Start Over" },

  // ─── Saju: Hours ───
  "saju.hour.unknown": { ko: "모름", en: "Unknown" },
  "saju.hour.0": { ko: "자시 (23:00-01:00)", en: "Ja-si (23:00-01:00)" },
  "saju.hour.2": { ko: "축시 (01:00-03:00)", en: "Chuk-si (01:00-03:00)" },
  "saju.hour.4": { ko: "인시 (03:00-05:00)", en: "In-si (03:00-05:00)" },
  "saju.hour.6": { ko: "묘시 (05:00-07:00)", en: "Myo-si (05:00-07:00)" },
  "saju.hour.8": { ko: "진시 (07:00-09:00)", en: "Jin-si (07:00-09:00)" },
  "saju.hour.10": { ko: "사시 (09:00-11:00)", en: "Sa-si (09:00-11:00)" },
  "saju.hour.12": { ko: "오시 (11:00-13:00)", en: "O-si (11:00-13:00)" },
  "saju.hour.14": { ko: "미시 (13:00-15:00)", en: "Mi-si (13:00-15:00)" },
  "saju.hour.16": { ko: "신시 (15:00-17:00)", en: "Sin-si (15:00-17:00)" },
  "saju.hour.18": { ko: "유시 (17:00-19:00)", en: "Yu-si (17:00-19:00)" },
  "saju.hour.20": { ko: "술시 (19:00-21:00)", en: "Sul-si (19:00-21:00)" },
  "saju.hour.22": { ko: "해시 (21:00-23:00)", en: "Hae-si (21:00-23:00)" },

  // ─── Saju: Result Section Headers ───
  "saju.result.convergence": { ko: "3대 시스템 합의점", en: "Triple System Convergence" },
  "saju.result.convergenceLevel": { ko: "일치", en: "agree" },
  "saju.result.convergenceSubtitle": {
    ko: "동서양 운명학이 한 목소리로 말하는 핵심 운명",
    en: "The core destiny all three systems agree on",
  },
  "saju.result.convergingSystems": { ko: "수렴:", en: "Converging:" },
  "saju.result.oneAction": { ko: "지금 딱 하나만 한다면", en: "If you do just one thing now" },
  "saju.result.energyAnalysis": { ko: "에너지 분석", en: "Energy Analysis" },
  "saju.result.fortune.love": { ko: "감정 에너지 (연애)", en: "Emotional Energy (Love)" },
  "saju.result.fortune.wealth": { ko: "풍요 에너지 (재물)", en: "Abundance Energy (Wealth)" },
  "saju.result.fortune.career": { ko: "재능 에너지 (직업)", en: "Talent Energy (Career)" },
  "saju.result.fortune.health": { ko: "생명 에너지 (건강)", en: "Life Energy (Health)" },
  "saju.result.fortune.fame": { ko: "성취 에너지 (명예)", en: "Achievement Energy (Fame)" },

  // ─── Saju: Saju Chart ───
  "saju.chart.title": { ko: "만세력", en: "Four Pillars Chart" },
  "saju.chart.hour": { ko: "시주", en: "Hour" },
  "saju.chart.day": { ko: "일주", en: "Day" },
  "saju.chart.month": { ko: "월주", en: "Month" },
  "saju.chart.year": { ko: "년주", en: "Year" },
  "saju.chart.heavenlyStem": { ko: "천간", en: "Stem" },
  "saju.chart.earthlyBranch": { ko: "지지", en: "Branch" },
  "saju.chart.tenGods": { ko: "십신", en: "Ten Gods" },
  "saju.chart.twelveStages": { ko: "12운성", en: "12 Stages" },
  "saju.chart.sinsals": { ko: "신살", en: "Sinsals" },

  // ─── Saju: Four Pillars AI ───
  "saju.fourPillars.title": { ko: "사주팔자 해석", en: "Four Pillars Interpretation" },
  "saju.fourPillars.interplay": { ko: "네 기둥의 상호작용", en: "Four Pillars Interaction" },

  // ─── Saju: Chapter Headers ───
  "saju.ch1.title": { ko: "당신의 본질", en: "Your Essence" },
  "saju.ch2.title": { ko: "인생의 흐름", en: "Life Flow" },
  "saju.ch2.subtitle": { ko: "연애, 재물, 직업 — 당신의 에너지가 향하는 곳", en: "Love, wealth, career — where your energy flows" },
  "saju.ch3.title": { ko: "관계와 타이밍", en: "Relationships & Timing" },
  "saju.ch3.subtitle": { ko: "누구와, 언제 — 운명의 교차점", en: "With whom, and when — destiny's crossroads" },
  "saju.ch4.title": { ko: "불편한 진실", en: "Uncomfortable Truths" },
  "saju.ch4.subtitle": { ko: "인정하기 싫지만 4개 시스템이 공통으로 경고합니다", en: "Hard to accept, but all systems warn about this" },
  "saju.ch5.title": { ko: "심화 시스템 분석", en: "Advanced System Analysis" },
  "saju.ch5.subtitle": { ko: "사주 · Vedic · 주역 개별 분석", en: "Saju · Vedic · I Ching individual analysis" },
  "saju.ch6.title": { ko: "운세 활용법", en: "Fortune Guide" },
  "saju.ch6.subtitle": { ko: "에너지를 극대화하는 실천 가이드", en: "Practical guide to maximize your energy" },

  // ─── Saju: Destiny Type ───
  "saju.destiny.type": { ko: "님의 운명 유형", en: "'s Destiny Type" },
  "saju.destiny.fallback": { ko: "운명 유형", en: "Destiny Type" },
  "saju.destiny.grade": { ko: "종합 운세 등급", en: "Overall Fortune Grade" },
  "saju.destiny.top": { ko: "상위", en: "Top" },
  "saju.destiny.national": { ko: "전국 기준", en: "National rank" },

  // ─── Saju: Day Master ───
  "saju.dayMaster.label": { ko: "일간", en: "Day Master" },
  "saju.dayMaster.elementBalance": { ko: "오행 밸런스", en: "FIVE ELEMENTS BALANCE" },

  // ─── Saju: Personality ───
  "saju.personality.title": { ko: "성격 분석", en: "Personality Analysis" },
  "saju.hiddenSelf.title": { ko: "숨겨진 매력과 재능", en: "Hidden Charm & Talents" },
  "saju.hiddenSelf.talents": { ko: "숨겨진 재능", en: "HIDDEN TALENTS" },
  "saju.hiddenSelf.pastLife": { ko: "조선시대 전생", en: "Past Life (Joseon Era)" },

  // ─── Saju: Life Narrative ───
  "saju.lifeNarrative.title": { ko: "인생 서사", en: "Life Narrative" },
  "saju.lifeNarrative.early": { ko: "초년 (1-30세)", en: "Early Years (1-30)" },
  "saju.lifeNarrative.mid": { ko: "중년 (31-50세)", en: "Middle Years (31-50)" },
  "saju.lifeNarrative.late": { ko: "말년 (51세~)", en: "Later Years (51+)" },

  // ─── Saju: Compatibility ───
  "saju.compatibility.title": { ko: "궁합 분석", en: "Compatibility Analysis" },
  "saju.compatibility.best": { ko: "최고의 파트너", en: "Best Partner" },
  "saju.compatibility.soulmate": { ko: "운명의 소울메이트", en: "Destined Soulmate" },
  "saju.compatibility.rival": { ko: "주의해야 할 유형", en: "Types to Watch" },

  // ─── Saju: Yearly / Monthly ───
  "saju.yearly.fortune": { ko: "년 운세", en: " Fortune" },
  "saju.yearly.events": { ko: "주요 운명 이벤트", en: "KEY DESTINY EVENTS" },
  "saju.monthly.title": { ko: "월별 운세", en: "Monthly Fortune" },

  // ─── Saju: Danger Warnings ───
  "saju.danger.title": { ko: "주의 경고", en: "Caution Warnings" },

  // ─── Saju: Vedic / I Ching ───
  "saju.vedic.title": { ko: "Vedic Dasha — 행성 에너지 주기", en: "Vedic Dasha — Planetary Energy Cycles" },
  "saju.vedic.nakshatra": { ko: "출생 Nakshatra (별)", en: "Birth Nakshatra (Star)" },
  "saju.vedic.mahadasha": { ko: "Mahadasha (대주기)", en: "Mahadasha (Major Period)" },
  "saju.vedic.antardasha": { ko: "Antardasha (소주기)", en: "Antardasha (Sub-period)" },
  "saju.iching.title": { ko: "주역 — 변화의 지혜", en: "I Ching — Wisdom of Change" },
  "saju.iching.hexagram": { ko: "괘", en: "Hexagram" },
  "saju.iching.changingLine": { ko: "변효", en: "Changing Line" },
  "saju.iching.changingLinePos": { ko: "효", en: "line" },
  "saju.iching.transformed": { ko: "지괘 (미래 방향)", en: "Transformed (Future Direction)" },

  // ─── Saju: Fortune Guide ───
  "saju.luckBoosters.title": { ko: "지금 바로 운 올리는 법", en: "Boost Your Luck Now" },
  "saju.luckyElements.title": { ko: "행운의 요소", en: "Lucky Elements" },
  "saju.luckyElements.color": { ko: "색상", en: "Color" },
  "saju.luckyElements.number": { ko: "숫자", en: "Number" },
  "saju.luckyElements.direction": { ko: "방향", en: "Direction" },
  "saju.luckyElements.season": { ko: "계절", en: "Season" },
  "saju.luckyElements.item": { ko: "아이템", en: "Item" },

  // ─── Elements ───
  "element.wood": { ko: "목", en: "Wood" },
  "element.fire": { ko: "화", en: "Fire" },
  "element.earth": { ko: "토", en: "Earth" },
  "element.metal": { ko: "금", en: "Metal" },
  "element.water": { ko: "수", en: "Water" },
} as const;

export type TranslationKey = keyof typeof translations;
