/**
 * Shared rate limiting + global daily cap + saju result caching.
 *
 * Primary: Supabase-backed persistent rate limiting (survives Vercel cold starts).
 * Fallback: In-memory rate limiting when Supabase is not configured.
 */

import { isSupabaseConfigured, getServerSupabase } from "./database/supabase";

// ─── Secure IP Hashing ───

/**
 * Hash an IP address using Web Crypto API (SHA-256).
 * Returns a hex string prefix for privacy-safe storage.
 */
export async function hashIpSecure(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`moodang_rate_${ip}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return "ip_" + hashArray.slice(0, 8).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── Per-IP Rate Limiting (Supabase + in-memory fallback) ───

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipLimits = new Map<string, RateLimitRecord>();

/**
 * Check per-IP rate limit.
 * Uses Supabase if configured, otherwise falls back to in-memory.
 */
export async function checkIpRateLimitAsync(
  ip: string,
  maxRequests: number,
  windowMs: number,
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return checkIpRateLimitMemory(ip, maxRequests, windowMs);
  }

  try {
    const ipHash = await hashIpSecure(ip);
    const supabase = getServerSupabase();
    const windowStart = new Date(Date.now() - windowMs).toISOString();

    // Upsert: increment count or reset if window expired
    const { data, error } = await supabase
      .from("rate_limits")
      .select("request_count, window_start")
      .eq("ip_hash", ipHash)
      .eq("endpoint", "api")
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found — that's fine
      console.error("[rate-limit] Supabase read error, falling back to memory:", error.message);
      return checkIpRateLimitMemory(ip, maxRequests, windowMs);
    }

    if (!data || new Date(data.window_start) < new Date(windowStart)) {
      // No record or window expired — reset
      await supabase.from("rate_limits").upsert({
        ip_hash: ipHash,
        endpoint: "api",
        request_count: 1,
        window_start: new Date().toISOString(),
      }, { onConflict: "ip_hash,endpoint" });
      return true;
    }

    if (data.request_count >= maxRequests) {
      return false;
    }

    // Increment count
    await supabase
      .from("rate_limits")
      .update({ request_count: data.request_count + 1 })
      .eq("ip_hash", ipHash)
      .eq("endpoint", "api");

    return true;
  } catch (e) {
    console.error("[rate-limit] Supabase rate limit failed, using memory fallback:", e);
    return checkIpRateLimitMemory(ip, maxRequests, windowMs);
  }
}

/** Synchronous in-memory rate limiting (original implementation) */
export function checkIpRateLimit(
  ip: string,
  maxRequests: number,
  windowMs: number,
): boolean {
  return checkIpRateLimitMemory(ip, maxRequests, windowMs);
}

function checkIpRateLimitMemory(
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
