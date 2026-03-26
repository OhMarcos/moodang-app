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

  // ─── Gwansang Page ───
  "gwansang.badge": { ko: "AI 관상", en: "AI Physiognomy" },
  "gwansang.title": { ko: "얼굴이 말하는 당신의 운명", en: "Your Destiny Written on Your Face" },
  "gwansang.subtitle": { ko: "전통 관상학의 지혜 · AI의 눈", en: "Wisdom of Traditional Physiognomy · Eyes of AI" },
  "gwansang.featureBadge": { ko: "12궁 · 삼정 · 오관 분석", en: "12 Palaces · 3 Courts · 5 Officers Analysis" },
  "gwansang.featureDesc": {
    ko: "수백 년간 전해 내려온 한국 전통 관상학의 지혜를\nAI 기술로 경험해보세요.",
    en: "Experience centuries of Korean traditional physiognomy wisdom\nthrough AI technology.",
  },
  "gwansang.startAnalysis": { ko: "관상 분석 시작하기", en: "Start Physiognomy Analysis" },
  "gwansang.howToUse": { ko: "이용 방법", en: "HOW IT WORKS" },
  "gwansang.step1.title": { ko: "사진 촬영", en: "Take Photo" },
  "gwansang.step1.desc": { ko: "정면 얼굴 사진을\n촬영하거나 업로드", en: "Take or upload\na front-facing photo" },
  "gwansang.step2.title": { ko: "AI 분석", en: "AI Analysis" },
  "gwansang.step2.desc": { ko: "12궁, 삼정, 오관\n전통 관상학 분석", en: "12 Palaces, 3 Courts,\n5 Officers analysis" },
  "gwansang.step3.title": { ko: "결과 확인", en: "View Results" },
  "gwansang.step3.desc": { ko: "성격, 운세, 조언\n상세 리포트 제공", en: "Personality, fortune,\ndetailed report" },
  "gwansang.retry": { ko: "다시 시도하기", en: "Try Again" },
  "gwansang.error.analysisFailed": { ko: "분석에 실패했습니다.", en: "Analysis failed." },
  "gwansang.error.unknown": { ko: "알 수 없는 오류가 발생했습니다.", en: "An unknown error occurred." },
  "gwansang.error.timeout": { ko: "분석 시간이 초과되었습니다. 다시 시도해주세요.", en: "Analysis timed out. Please try again." },

  // ─── Gwansang: Analysis Progress ───
  "gwansang.progress.title": { ko: "관상 분석 중", en: "Analyzing Physiognomy" },
  "gwansang.progress.step0": { ko: "얼굴의 전체적인 인상을 살펴보고 있습니다...", en: "Examining overall facial impression..." },
  "gwansang.progress.step1": { ko: "이마와 관록궁을 분석하고 있습니다...", en: "Analyzing forehead and career palace..." },
  "gwansang.progress.step2": { ko: "눈썹의 기운을 읽고 있습니다...", en: "Reading the energy of your eyebrows..." },
  "gwansang.progress.step3": { ko: "눈(감찰관)의 빛을 살펴보고 있습니다...", en: "Examining the light of your eyes..." },
  "gwansang.progress.step4": { ko: "코(심판관)의 형상을 분석하고 있습니다...", en: "Analyzing the shape of your nose..." },
  "gwansang.progress.step5": { ko: "입(출납관)의 복을 읽고 있습니다...", en: "Reading the fortune of your mouth..." },
  "gwansang.progress.step6": { ko: "삼정의 균형을 확인하고 있습니다...", en: "Checking the balance of three courts..." },
  "gwansang.progress.step7": { ko: "오악과 오관을 종합하고 있습니다...", en: "Synthesizing five mountains and five officers..." },
  "gwansang.progress.step8": { ko: "12궁의 운세를 해석하고 있습니다...", en: "Interpreting the fortune of 12 palaces..." },
  "gwansang.progress.step9": { ko: "관상 분석을 마무리하고 있습니다...", en: "Finalizing physiognomy analysis..." },

  // ─── Gwansang: Reading Result ───
  "gwansang.result.title": { ko: "관상 분석 결과", en: "Physiognomy Analysis Results" },
  "gwansang.result.faceZone.title": { ko: "얼굴 구역별 분석 근거", en: "Analysis by Face Zone" },
  "gwansang.result.faceZone.desc": { ko: "각 구역이 관상학에서 어떤 역할을 하는지 확인하세요", en: "See what each zone reveals in physiognomy" },
  "gwansang.result.stats.title": { ko: "능력치 분석", en: "Stats Analysis" },
  "gwansang.result.stats.sexAppeal": { ko: "색기", en: "Sex Appeal" },
  "gwansang.result.stats.sexAppeal.desc": { ko: "이성을 끌어당기는 매력", en: "Attractiveness to others" },
  "gwansang.result.stats.sharpMind": { ko: "총기", en: "Sharp Mind" },
  "gwansang.result.stats.sharpMind.desc": { ko: "지적 능력과 판단력", en: "Intellectual ability and judgment" },
  "gwansang.result.stats.wealthPotential": { ko: "재력", en: "Wealth" },
  "gwansang.result.stats.wealthPotential.desc": { ko: "재물을 모으는 능력", en: "Ability to accumulate wealth" },
  "gwansang.result.stats.peopleLuck": { ko: "인복", en: "People Luck" },
  "gwansang.result.stats.peopleLuck.desc": { ko: "좋은 사람이 모이는 힘", en: "Power to attract good people" },
  "gwansang.result.stats.mainCharacterEnergy": { ko: "관종력", en: "Charisma" },
  "gwansang.result.stats.mainCharacterEnergy.desc": { ko: "존재감과 주목도", en: "Presence and attention power" },
  "gwansang.result.harshTruths": { ko: "불편한 진실", en: "Harsh Truths" },
  "gwansang.result.warning": { ko: "경고", en: "WARNING" },
  "gwansang.result.nickname.label": { ko: "당신의 관상 별명", en: "Your Physiognomy Nickname" },
  "gwansang.result.charm.title": { ko: "매력/색기 지수", en: "Charm / Sex Appeal Index" },
  "gwansang.result.charm.unit": { ko: "점", en: "pts" },
  "gwansang.result.hiddenCharm": { ko: "숨은 매력", en: "Hidden Charm" },
  "gwansang.result.hiddenTalent": { ko: "숨은 재능", en: "Hidden Talent" },
  "gwansang.result.romanticFortune": { ko: "이성 복/배우자 복", en: "Romantic / Spouse Fortune" },
  "gwansang.result.pastLife": { ko: "조선시대 전생 직업", en: "Past Life Occupation (Joseon Era)" },
  "gwansang.result.fortune.title": { ko: "운세 분석", en: "Fortune Analysis" },
  "gwansang.result.fortune.wealth": { ko: "재물운", en: "Wealth Fortune" },
  "gwansang.result.fortune.love": { ko: "애정운", en: "Love Fortune" },
  "gwansang.result.fortune.career": { ko: "직업운", en: "Career Fortune" },
  "gwansang.result.fortune.health": { ko: "건강운", en: "Health Fortune" },
  "gwansang.result.fortune.relationships": { ko: "대인관계", en: "Relationships" },
  "gwansang.result.features.title": { ko: "이목구비 분석", en: "Facial Feature Analysis" },
  "gwansang.result.features.forehead": { ko: "이마", en: "Forehead" },
  "gwansang.result.features.eyebrows": { ko: "눈썹", en: "Eyebrows" },
  "gwansang.result.features.eyes": { ko: "눈", en: "Eyes" },
  "gwansang.result.features.nose": { ko: "코", en: "Nose" },
  "gwansang.result.features.mouth": { ko: "입", en: "Mouth" },
  "gwansang.result.features.ears": { ko: "귀", en: "Ears" },
  "gwansang.result.features.chin": { ko: "턱", en: "Chin" },
  "gwansang.result.faceDiagram.title": { ko: "관상학 얼굴 분석도", en: "Physiognomy Face Map" },
  "gwansang.result.faceDiagram.desc": { ko: "12궁 · 삼정 · 오관 관상학 매핑", en: "12 Palaces · 3 Courts · 5 Officers mapping" },
  "gwansang.result.luckyElements.title": { ko: "행운의 요소", en: "Lucky Elements" },
  "gwansang.result.luckyElements.color": { ko: "행운의 색", en: "Lucky Color" },
  "gwansang.result.luckyElements.number": { ko: "행운의 숫자", en: "Lucky Number" },
  "gwansang.result.luckyElements.direction": { ko: "행운의 방향", en: "Lucky Direction" },
  "gwansang.result.overall.title": { ko: "종합 인상 & 인생 조언", en: "Overall Impression & Life Advice" },
  "gwansang.result.resetButton": { ko: "다시 분석하기", en: "Analyze Again" },
  "gwansang.result.disclaimer": {
    ko: "본 서비스는 전통 관상학을 기반으로 한 재미용 콘텐츠입니다.\n실제 운명이나 미래를 예측하지 않습니다.",
    en: "This service is entertainment content based on traditional physiognomy.\nIt does not predict actual destiny or future.",
  },

  // ─── Gwansang: Face Zone Map ───
  "gwansang.faceZone.tapHint": { ko: "구역을 탭하여 분석 근거를 확인하세요", en: "Tap a zone to see analysis details" },
  "gwansang.faceZone.close": { ko: "닫기", en: "Close" },
  "gwansang.faceZone.position": { ko: "관상학 위치:", en: "Physiognomy position:" },
  "gwansang.faceZone.detected": { ko: "감지:", en: "Detected:" },
  "gwansang.faceZone.relatedFortune": { ko: "→ 연관 운세:", en: "→ Related fortune:" },
  "gwansang.faceZone.unit": { ko: "점", en: "pts" },
  "gwansang.faceZone.legend.grid": { ko: "삼정 구분선", en: "3 Courts divider" },
  "gwansang.faceZone.legend.zone": { ko: "분석 구역", en: "Analysis zone" },
  "gwansang.faceZone.legend.line": { ko: "연결선", en: "Connection" },
  "gwansang.faceZone.alt": { ko: "분석 대상 얼굴", en: "Face for analysis" },
  "gwansang.faceZone.forehead": { ko: "이마", en: "Forehead" },
  "gwansang.faceZone.eyebrows": { ko: "눈썹", en: "Eyebrows" },
  "gwansang.faceZone.eyes": { ko: "눈", en: "Eyes" },
  "gwansang.faceZone.nose": { ko: "코", en: "Nose" },
  "gwansang.faceZone.mouth": { ko: "입", en: "Mouth" },
  "gwansang.faceZone.ears": { ko: "귀", en: "Ears" },
  "gwansang.faceZone.chin": { ko: "턱", en: "Chin" },
  "gwansang.faceZone.role.forehead": {
    ko: "관록궁 · 복덕궁 — 초년운, 지적 능력, 사회적 지위",
    en: "Career Palace · Virtue Palace — early fortune, intellect, social status",
  },
  "gwansang.faceZone.role.eyebrows": {
    ko: "형제궁 · 보수관 — 형제운, 감정 표현, 수명",
    en: "Sibling Palace · Longevity Officer — sibling fortune, emotions, lifespan",
  },
  "gwansang.faceZone.role.eyes": {
    ko: "명궁 · 감찰관 — 선천 운명, 내면, 의지력",
    en: "Life Palace · Inspector Officer — innate destiny, inner self, willpower",
  },
  "gwansang.faceZone.role.nose": {
    ko: "재백궁 · 심판관 — 재물운, 자존감, 40대 운세",
    en: "Wealth Palace · Judge Officer — wealth fortune, self-esteem, 40s fortune",
  },
  "gwansang.faceZone.role.mouth": {
    ko: "출납관 — 언어 능력, 식복, 대인관계",
    en: "Treasurer Officer — language ability, food fortune, relationships",
  },
  "gwansang.faceZone.role.ears": {
    ko: "채청관 — 수명, 지혜, 어린 시절 환경",
    en: "Listening Officer — lifespan, wisdom, childhood environment",
  },
  "gwansang.faceZone.role.chin": {
    ko: "노복궁 · 지각 — 말년운, 부하운, 부동산운",
    en: "Servant Palace · Earth Base — late fortune, subordinate luck, property",
  },
  "gwansang.faceZone.grid.upper": { ko: "상정(上停)", en: "Upper Court" },
  "gwansang.faceZone.grid.upper.desc": { ko: "초년운 · 지성 · 부모운", en: "Early fortune · Intellect · Parent luck" },
  "gwansang.faceZone.grid.middle": { ko: "중정(中停)", en: "Middle Court" },
  "gwansang.faceZone.grid.middle.desc": { ko: "중년운 · 의지 · 사회운", en: "Mid-life fortune · Will · Social luck" },
  "gwansang.faceZone.grid.lower": { ko: "하정(下停)", en: "Lower Court" },
  "gwansang.faceZone.grid.lower.desc": { ko: "말년운 · 실행 · 부하운", en: "Late fortune · Execution · Subordinate luck" },

  // ─── FaceCapture ───
  "capture.instruction": {
    ko: "정면을 바라보는 얼굴 사진을\n촬영하거나 업로드해주세요",
    en: "Take or upload a front-facing\nphoto of your face",
  },
  "capture.camera": { ko: "카메라 촬영", en: "Take Photo" },
  "capture.upload": { ko: "사진 업로드", en: "Upload Photo" },
  "capture.privacy": { ko: "촬영된 사진은 분석 후 저장되지 않습니다.", en: "Photos are not stored after analysis." },
  "capture.cancel": { ko: "취소", en: "Cancel" },
  "capture.shoot": { ko: "촬영하기", en: "Capture" },
  "capture.retake": { ko: "다시 촬영", en: "Retake" },
  "capture.previewAlt": { ko: "촬영된 얼굴", en: "Captured face" },
  "capture.error.noCamera": { ko: "카메라에 접근할 수 없습니다. 카메라 권한을 확인해주세요.", en: "Cannot access camera. Please check camera permissions." },
  "capture.error.notImage": { ko: "이미지 파일만 업로드 가능합니다.", en: "Only image files can be uploaded." },
  "capture.error.processFailed": { ko: "이미지를 처리할 수 없습니다. 다른 이미지를 시도해주세요.", en: "Cannot process image. Please try another image." },

  // ─── Saju: Analysis Progress ───
  "saju.progress.title": { ko: "님의 운명을 분석하고 있습니다", en: "'s destiny is being analyzed" },
  "saju.progress.step0": { ko: "사주팔자 정보를 확인하고 있습니다...", en: "Verifying Four Pillars information..." },
  "saju.progress.step1": { ko: "년주(年柱)와 월주(月柱)를 분석하고 있습니다...", en: "Analyzing Year and Month Pillars..." },
  "saju.progress.step2": { ko: "일주(日柱) 일간의 힘을 측정하고 있습니다...", en: "Measuring Day Pillar strength..." },
  "saju.progress.step3": { ko: "시주(時柱)의 흐름을 파악하고 있습니다...", en: "Reading the flow of Hour Pillar..." },
  "saju.progress.step4": { ko: "십신(十神)과 용신(用神)을 해석하고 있습니다...", en: "Interpreting Ten Gods and Useful God..." },
  "saju.progress.step5": { ko: "오행(五行) 균형을 확인하고 있습니다...", en: "Checking Five Elements balance..." },
  "saju.progress.step6": { ko: "대운(大運) 흐름을 계산하고 있습니다...", en: "Calculating Major Fortune cycles..." },
  "saju.progress.step7": { ko: "베딕 나크샤트라와 다샤를 분석하고 있습니다...", en: "Analyzing Vedic Nakshatra and Dasha..." },
  "saju.progress.step8": { ko: "주역 괘상을 해석하고 있습니다...", en: "Interpreting I Ching hexagram..." },
  "saju.progress.step9": { ko: "삼중 렌즈 교차분석을 마무리하고 있습니다...", en: "Finalizing Triple Lens cross-analysis..." },

  // ─── Share Buttons ───
  "share.save": { ko: "이미지 저장", en: "Save Image" },
  "share.saved": { ko: "저장됨!", en: "Saved!" },
  "share.share": { ko: "공유하기", en: "Share" },
  "share.shared": { ko: "공유됨!", en: "Shared!" },
  "share.copyLink": { ko: "링크 복사", en: "Copy Link" },
  "share.copied": { ko: "링크 복사됨!", en: "Link Copied!" },
  "share.gwansangLabel": { ko: "AI 관상 분석", en: "AI Physiognomy Analysis" },
  "share.sajuLabel": { ko: "사주팔자 분석", en: "Four Pillars Analysis" },
  "share.shareText.suffix": { ko: "결과\n나도 해보기 →", en: "Results\nTry it yourself →" },

  // ─── Share Page ───
  "sharePage.gwansang.badge": { ko: "AI 관상", en: "AI Physiognomy" },
  "sharePage.saju.badge": { ko: "사주팔자", en: "Four Pillars" },
  "sharePage.gwansang.shared": { ko: "친구가 관상 분석을 공유했어요", en: "Your friend shared a physiognomy reading" },
  "sharePage.saju.shared": { ko: "친구가 사주 분석을 공유했어요", en: "Your friend shared a destiny reading" },
  "sharePage.grade": { ko: "등급", en: "Grade" },
  "sharePage.celebrityMatch": { ko: "유명인 매칭:", en: "Celebrity Match:" },
  "sharePage.fullResult": { ko: "전체 결과를 보려면 나도 분석해보세요", en: "Get your own analysis to see full results" },
  "sharePage.gwansang.cta": { ko: "나도 얼굴 사진으로 관상을 분석해보세요", en: "Analyze your physiognomy with a photo too" },
  "sharePage.saju.cta": { ko: "나도 생년월일로 사주을 분석해보세요", en: "Analyze your destiny with your birth date too" },
  "sharePage.tryIt": { ko: "나도 해보기", en: "Try It Myself" },
  "sharePage.socialProof": { ko: "전통 동양학 기반 AI 분석 서비스", en: "AI analysis powered by Eastern traditions" },
  "sharePage.home": { ko: "무당 MOODANG 홈으로", en: "Go to MOODANG Home" },
  "sharePage.gwansang.features": {
    ko: "색기 / 총기 / 재력 / 인복 / 관종력 점수|Pokemon 카드 스타일 분석|불편한 진실 + 전생 직업",
    en: "Sex Appeal / Sharp Mind / Wealth / People Luck / Charisma scores|Pokemon card-style analysis|Harsh truths + Past life occupation",
  },
  "sharePage.saju.features": {
    ko: "운명 유형 + SSS~C 등급|재물 / 연애 / 직업 / 건강 / 명예 점수|유명인 매칭 + 올해 운세",
    en: "Destiny type + SSS~C grade|Wealth / Love / Career / Health / Fame scores|Celebrity match + This year's fortune",
  },

  // ─── Error Pages ───
  "error.pageLoad": { ko: "페이지 로드 중 오류가 발생했습니다", en: "An error occurred while loading the page" },
  "error.generic": { ko: "오류가 발생했습니다", en: "An error occurred" },
  "error.retry": { ko: "다시 시도", en: "Try Again" },

  // ─── Common ───
  "common.result": { ko: "결과", en: "Results" },
  "common.advice": { ko: "조언", en: "Advice" },
} as const;

export type TranslationKey = keyof typeof translations;
