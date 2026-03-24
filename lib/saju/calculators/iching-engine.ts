import { getSolarDate } from "@gracefullight/saju";
import type { SajuInput } from "../types";
import type { PreComputedIChing } from "./types";

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

// ─── 8 Trigrams (팔괘) ───
const TRIGRAMS = [
  { name: "건(乾)", symbol: "☰", element: "천(天)" },  // 0 → 건
  { name: "태(兌)", symbol: "☱", element: "택(澤)" },  // 1 → 태
  { name: "이(離)", symbol: "☲", element: "화(火)" },  // 2 → 이
  { name: "진(震)", symbol: "☳", element: "뇌(雷)" },  // 3 → 진
  { name: "손(巽)", symbol: "☴", element: "풍(風)" },  // 4 → 손
  { name: "감(坎)", symbol: "☵", element: "수(水)" },  // 5 → 감
  { name: "간(艮)", symbol: "☶", element: "산(山)" },  // 6 → 간
  { name: "곤(坤)", symbol: "☷", element: "지(地)" },  // 7 → 곤
];

// ─── 64 Hexagram lookup: [upper trigram index][lower trigram index] → hexagram number ───
const HEXAGRAM_MATRIX = [
  [1, 43, 14, 34,  9,  5, 26, 11],  // upper: 건
  [10, 58, 38, 54, 61, 60, 41, 19],  // upper: 태
  [13, 49, 30, 55, 37, 63, 22, 36],  // upper: 이
  [25, 17, 21, 51, 42,  3, 27, 24],  // upper: 진
  [44, 28, 50, 32, 57, 48, 18, 46],  // upper: 손
  [ 6, 47, 64, 40, 59, 29,  4,  7],  // upper: 감
  [33, 31, 56, 62, 53, 39, 52, 15],  // upper: 간
  [12, 45, 35, 16, 20,  8, 23,  2],  // upper: 곤
];

// ─── 64 Hexagram names ───
const HEXAGRAMS: { name: string; hanja: string }[] = [
  { name: "건위천", hanja: "乾爲天" },       // 1
  { name: "곤위지", hanja: "坤爲地" },       // 2
  { name: "수뢰둔", hanja: "水雷屯" },       // 3
  { name: "산수몽", hanja: "山水蒙" },       // 4
  { name: "수천수", hanja: "水天需" },       // 5
  { name: "천수송", hanja: "天水訟" },       // 6
  { name: "지수사", hanja: "地水師" },       // 7
  { name: "수지비", hanja: "水地比" },       // 8
  { name: "풍천소축", hanja: "風天小畜" },   // 9
  { name: "천택리", hanja: "天澤履" },       // 10
  { name: "지천태", hanja: "地天泰" },       // 11
  { name: "천지비", hanja: "天地否" },       // 12
  { name: "천화동인", hanja: "天火同人" },   // 13
  { name: "화천대유", hanja: "火天大有" },   // 14
  { name: "지산겸", hanja: "地山謙" },       // 15
  { name: "뇌지예", hanja: "雷地豫" },       // 16
  { name: "택뢰수", hanja: "澤雷隨" },       // 17
  { name: "산풍고", hanja: "山風蠱" },       // 18
  { name: "지택림", hanja: "地澤臨" },       // 19
  { name: "풍지관", hanja: "風地觀" },       // 20
  { name: "화뢰서합", hanja: "火雷噬嗑" },   // 21
  { name: "산화비", hanja: "山火賁" },       // 22
  { name: "산지박", hanja: "山地剝" },       // 23
  { name: "지뢰복", hanja: "地雷復" },       // 24
  { name: "천뢰무망", hanja: "天雷無妄" },   // 25
  { name: "산천대축", hanja: "山天大畜" },   // 26
  { name: "산뢰이", hanja: "山雷頤" },       // 27
  { name: "택풍대과", hanja: "澤風大過" },   // 28
  { name: "감위수", hanja: "坎爲水" },       // 29
  { name: "이위화", hanja: "離爲火" },       // 30
  { name: "택산함", hanja: "澤山咸" },       // 31
  { name: "뇌풍항", hanja: "雷風恒" },       // 32
  { name: "천산둔", hanja: "天山遯" },       // 33
  { name: "뇌천대장", hanja: "雷天大壯" },   // 34
  { name: "화지진", hanja: "火地晉" },       // 35
  { name: "지화명이", hanja: "地火明夷" },   // 36
  { name: "풍화가인", hanja: "風火家人" },   // 37
  { name: "화택규", hanja: "火澤睽" },       // 38
  { name: "수산건", hanja: "水山蹇" },       // 39
  { name: "뇌수해", hanja: "雷水解" },       // 40
  { name: "산택손", hanja: "山澤損" },       // 41
  { name: "풍뢰익", hanja: "風雷益" },       // 42
  { name: "택천쾌", hanja: "澤天夬" },       // 43
  { name: "천풍구", hanja: "天風姤" },       // 44
  { name: "택지췌", hanja: "澤地萃" },       // 45
  { name: "지풍승", hanja: "地風升" },       // 46
  { name: "택수곤", hanja: "澤水困" },       // 47
  { name: "수풍정", hanja: "水風井" },       // 48
  { name: "택화혁", hanja: "澤火革" },       // 49
  { name: "화풍정", hanja: "火風鼎" },       // 50
  { name: "진위뢰", hanja: "震爲雷" },       // 51
  { name: "간위산", hanja: "艮爲山" },       // 52
  { name: "풍산점", hanja: "風山漸" },       // 53
  { name: "뇌택귀매", hanja: "雷澤歸妹" },   // 54
  { name: "뇌화풍", hanja: "雷火豐" },       // 55
  { name: "화산려", hanja: "火山旅" },       // 56
  { name: "손위풍", hanja: "巽爲風" },       // 57
  { name: "태위택", hanja: "兌爲澤" },       // 58
  { name: "풍수환", hanja: "風水渙" },       // 59
  { name: "수택절", hanja: "水澤節" },       // 60
  { name: "풍택중부", hanja: "風澤中孚" },   // 61
  { name: "뇌산소과", hanja: "雷山小過" },   // 62
  { name: "수화기제", hanja: "水火旣濟" },   // 63
  { name: "화수미제", hanja: "火水未濟" },   // 64
];

/**
 * Get the trigram binary representation (3 bits)
 * 건=111, 태=110, 이=101, 진=100, 손=011, 감=010, 간=001, 곤=000
 */
const TRIGRAM_BITS = [
  0b111, // 건 ☰
  0b110, // 태 ☱
  0b101, // 이 ☲
  0b100, // 진 ☳
  0b011, // 손 ☴
  0b010, // 감 ☵
  0b001, // 간 ☶
  0b000, // 곤 ☷
];

/**
 * Flip a specific line in a hexagram (6 lines, bottom=1, top=6).
 * Returns the transformed hexagram number.
 */
function getTransformedHexagram(upperIdx: number, lowerIdx: number, changingLine: number): number {
  // Combine into 6-bit number (upper=bits 5-3, lower=bits 2-0)
  const upperBits = TRIGRAM_BITS[upperIdx];
  const lowerBits = TRIGRAM_BITS[lowerIdx];
  let hexBits = (upperBits << 3) | lowerBits;

  // Flip the changing line bit (line 1 = bit 0, line 6 = bit 5)
  const bitPos = changingLine - 1;
  hexBits ^= (1 << bitPos);

  // Split back into upper and lower trigrams
  const newUpperBits = (hexBits >> 3) & 0b111;
  const newLowerBits = hexBits & 0b111;

  // Find trigram indices from bits
  const newUpperIdx = TRIGRAM_BITS.indexOf(newUpperBits);
  const newLowerIdx = TRIGRAM_BITS.indexOf(newLowerBits);

  if (newUpperIdx === -1 || newLowerIdx === -1) return 1; // fallback

  return HEXAGRAM_MATRIX[newUpperIdx][newLowerIdx];
}

/**
 * 매화역수(梅花易數) method for I Ching hexagram derivation.
 *
 * Formula:
 * - 상괘 = (년 + 월 + 일) mod 8
 * - 하괘 = (년 + 월 + 일 + 시) mod 8
 * - 변효 = (년 + 월 + 일 + 시) mod 6
 *
 * Note: mod 8 → if result is 0, use 8 (= 곤); mod 6 → if 0, use 6
 */
export function calculateIChing(input: SajuInput): PreComputedIChing {
  const solar = resolveSolarDate(input);
  const { birthHour } = input;

  // 시수: convert 24-hour to 12 지지 time block (1-12)
  const hourBlock = Math.floor(((birthHour + 1) % 24) / 2) + 1;

  const sum1 = solar.year + solar.month + solar.day;
  const sum2 = sum1 + hourBlock;

  // mod 8 (1-indexed: 0 → 8)
  let upperIdx = sum1 % 8;
  if (upperIdx === 0) upperIdx = 8;
  upperIdx -= 1; // convert to 0-indexed for array

  let lowerIdx = sum2 % 8;
  if (lowerIdx === 0) lowerIdx = 8;
  lowerIdx -= 1;

  // mod 6 (1-indexed: 0 → 6)
  let changingLine = sum2 % 6;
  if (changingLine === 0) changingLine = 6;

  const hexNum = HEXAGRAM_MATRIX[upperIdx][lowerIdx];
  const transformedNum = getTransformedHexagram(upperIdx, lowerIdx, changingLine);

  const hexData = HEXAGRAMS[hexNum - 1] ?? { name: `괘${hexNum}`, hanja: `卦${hexNum}` };
  const transData = HEXAGRAMS[transformedNum - 1] ?? { name: `괘${transformedNum}`, hanja: `卦${transformedNum}` };

  return {
    hexagramNumber: hexNum,
    hexagramName: hexData.name,
    hexagramHanja: hexData.hanja,
    upperTrigram: {
      index: upperIdx,
      name: TRIGRAMS[upperIdx].name,
      symbol: TRIGRAMS[upperIdx].symbol,
    },
    lowerTrigram: {
      index: lowerIdx,
      name: TRIGRAMS[lowerIdx].name,
      symbol: TRIGRAMS[lowerIdx].symbol,
    },
    changingLine,
    transformedHexagram: {
      number: transformedNum,
      name: transData.name,
      hanja: transData.hanja,
    },
  };
}
