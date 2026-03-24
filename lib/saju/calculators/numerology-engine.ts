import { getSolarDate } from "@gracefullight/saju";
import type { SajuInput } from "../types";
import type { PreComputedNumerology } from "./types";

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

// ─── Pythagorean letter-to-number mapping ───
const PYTHAGOREAN: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

// ─── Personal Year themes ───
const PERSONAL_YEAR_THEMES: Record<number, string> = {
  1: "새로운 시작의 해",
  2: "협력과 인내의 해",
  3: "창의와 표현의 해",
  4: "안정과 기반 구축의 해",
  5: "변화와 자유의 해",
  6: "책임과 봉사의 해",
  7: "내면 탐구와 성찰의 해",
  8: "성취와 풍요의 해",
  9: "완성과 마무리의 해",
  11: "영적 각성의 해",
  22: "마스터 빌더의 해",
  33: "마스터 교사의 해",
};

/**
 * Reduce a number to a single digit by summing its digits.
 * Preserves Master Numbers: 11, 22, 33.
 */
function reduceNumber(num: number): number {
  // Ensure positive
  num = Math.abs(num);

  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    let sum = 0;
    while (num > 0) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    num = sum;
  }
  return num;
}

/**
 * Sum digits of a number (single pass, no master number check).
 */
function digitSum(num: number): number {
  let sum = 0;
  num = Math.abs(num);
  while (num > 0) {
    sum += num % 10;
    num = Math.floor(num / 10);
  }
  return sum;
}

/**
 * Life Path Number:
 * Reduce year, month, day SEPARATELY first, then sum and reduce again.
 * Master Numbers (11, 22, 33) are preserved at each step.
 */
function calculateLifePath(year: number, month: number, day: number): number {
  const yearReduced = reduceNumber(digitSum(year));
  const monthReduced = reduceNumber(month);
  const dayReduced = reduceNumber(day);
  return reduceNumber(yearReduced + monthReduced + dayReduced);
}

/**
 * Personal Year Number:
 * (birth month + birth day + current year digits) reduced.
 */
function calculatePersonalYear(birthMonth: number, birthDay: number, currentYear: number): number {
  const yearReduced = reduceNumber(digitSum(currentYear));
  const monthReduced = reduceNumber(birthMonth);
  const dayReduced = reduceNumber(birthDay);
  return reduceNumber(yearReduced + monthReduced + dayReduced);
}

/**
 * Expression Number (Destiny Number):
 * Sum all letters of full English name using Pythagorean values.
 */
function calculateExpressionNumber(name: string): number {
  const sum = name
    .toUpperCase()
    .split("")
    .filter((ch) => ch in PYTHAGOREAN)
    .reduce((total, ch) => total + PYTHAGOREAN[ch], 0);
  return reduceNumber(sum);
}

/**
 * Soul Urge Number (Heart's Desire):
 * Sum only vowels (A, E, I, O, U) of English name.
 */
function calculateSoulUrge(name: string): number {
  const sum = name
    .toUpperCase()
    .split("")
    .filter((ch) => VOWELS.has(ch))
    .reduce((total, ch) => total + PYTHAGOREAN[ch], 0);
  return reduceNumber(sum);
}

export function calculateNumerology(input: SajuInput): PreComputedNumerology {
  const solar = resolveSolarDate(input);
  const { englishName } = input;
  const currentYear = new Date().getFullYear();

  const lifePath = calculateLifePath(solar.year, solar.month, solar.day);
  const personalYear = calculatePersonalYear(solar.month, solar.day, currentYear);
  const personalYearTheme = PERSONAL_YEAR_THEMES[personalYear] ?? "변화의 해";

  const trimmedName = englishName?.trim() ?? "";
  const hasLetters = trimmedName.length > 0 && /[A-Za-z]/.test(trimmedName);

  const expressionNumber = hasLetters
    ? calculateExpressionNumber(trimmedName)
    : null;

  // Soul Urge requires at least one vowel; return null if no vowels present
  const hasVowels = hasLetters && /[AEIOUaeiou]/.test(trimmedName);
  const soulUrge = hasVowels
    ? calculateSoulUrge(trimmedName)
    : null;

  return {
    lifePath,
    personalYear,
    personalYearTheme,
    expressionNumber,
    soulUrge,
  };
}
