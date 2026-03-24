/**
 * Shared rate limiting + global daily cap + saju result caching.
 *
 * All state is in-memory (resets on server restart / redeploy).
 * For a small viral app on Vercel this is fine — each cold start
 * resets counters, which is a natural safety valve.
 */

// ─── Per-IP Rate Limiting ───

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipLimits = new Map<string, RateLimitRecord>();

export function checkIpRateLimit(
  ip: string,
  maxRequests: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const record = ipLimits.get(ip);

  if (!record || now > record.resetAt) {
    ipLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  ipLimits.set(ip, { count: record.count + 1, resetAt: record.resetAt });
  return true;
}

// ─── Global Daily Cap ───

const DAILY_CAP = 10_000; // max requests per day across all users

interface DailyCounter {
  date: string; // YYYY-MM-DD in KST
  count: number;
}

let dailyCounter: DailyCounter = { date: "", count: 0 };

function getTodayKST(): string {
  // Use explicit UTC offset (+9h) to avoid locale-dependent formatting
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

export function checkDailyCap(): { allowed: boolean; remaining: number } {
  const today = getTodayKST();

  if (dailyCounter.date !== today) {
    dailyCounter = { date: today, count: 0 };
  }

  if (dailyCounter.count >= DAILY_CAP) {
    return { allowed: false, remaining: 0 };
  }

  dailyCounter.count++;
  return { allowed: true, remaining: DAILY_CAP - dailyCounter.count };
}

export function getDailyUsage(): { date: string; count: number; cap: number } {
  const today = getTodayKST();
  if (dailyCounter.date !== today) {
    return { date: today, count: 0, cap: DAILY_CAP };
  }
  return { date: dailyCounter.date, count: dailyCounter.count, cap: DAILY_CAP };
}

// ─── Saju Result Cache ───
// Key = hash of (birthYear, birthMonth, birthDay, birthHour, birthMinute, gender, calendarType)
// Value = JSON string of SajuReading
// TTL = 24 hours (same birth data gives same reading within a day)

const SAJU_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const SAJU_CACHE_MAX_SIZE = 5_000; // prevent memory bloat

interface CacheEntry {
  data: string;
  expiresAt: number;
}

const sajuCache = new Map<string, CacheEntry>();

export function buildSajuCacheKey(input: {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  gender: string;
  calendarType: string;
}): string {
  return `${input.birthYear}-${input.birthMonth}-${input.birthDay}-${input.birthHour}-${input.birthMinute}-${input.gender}-${input.calendarType}`;
}

export function getSajuCache(key: string): string | null {
  const entry = sajuCache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    sajuCache.delete(key);
    return null;
  }

  return entry.data;
}

export function setSajuCache(key: string, data: string): void {
  // Evict oldest entries if cache is too large
  if (sajuCache.size >= SAJU_CACHE_MAX_SIZE) {
    const firstKey = sajuCache.keys().next().value;
    if (firstKey) sajuCache.delete(firstKey);
  }

  sajuCache.set(key, {
    data,
    expiresAt: Date.now() + SAJU_CACHE_TTL_MS,
  });
}

export function getSajuCacheStats(): { size: number; maxSize: number } {
  return { size: sajuCache.size, maxSize: SAJU_CACHE_MAX_SIZE };
}
