import { getServerSupabase, isSupabaseConfigured } from "./supabase";
import type { ReadingInsert, ReadingRow } from "./types";

/**
 * Save a reading to the database.
 * Returns the reading ID on success, null if DB is not configured or insert fails.
 */
export async function saveReading(
  params: {
    sessionId: string;
    readingType: "saju" | "gwansang";
    inputData: Record<string, unknown>;
    precomputedData?: Record<string, unknown> | null;
    aiResult: Record<string, unknown>;
    fortuneGrade?: string | null;
    destinyTypeHanja?: string | null;
    dayMaster?: string | null;
    celebrityMatch?: string | null;
    ipHash?: string | null;
  },
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const row: ReadingInsert = {
    session_id: params.sessionId,
    reading_type: params.readingType,
    input_data: params.inputData,
    precomputed_data: params.precomputedData ?? null,
    ai_result: params.aiResult,
    fortune_grade: params.fortuneGrade ?? null,
    destiny_type_hanja: params.destinyTypeHanja ?? null,
    day_master: params.dayMaster ?? null,
    celebrity_match: params.celebrityMatch ?? null,
    ip_hash: params.ipHash ?? null,
  };

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("readings")
      .insert(row)
      .select("id")
      .single();

    if (error) {
      console.error("[saveReading] Supabase insert error:", error.message);
      return null;
    }

    return data.id;
  } catch (err) {
    console.error("[saveReading] Unexpected error:", err);
    return null;
  }
}

/**
 * Get a reading by ID (for share pages).
 */
export async function getReading(id: string): Promise<ReadingRow | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("readings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[getReading] Supabase query error:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("[getReading] Unexpected error:", err);
    return null;
  }
}

/**
 * Get recent readings for a session (anonymous history).
 * Returns newest first, limited to 20.
 */
export async function getReadingsBySession(
  sessionId: string,
  limit = 20,
): Promise<ReadingRow[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("readings")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[getReadingsBySession] Supabase query error:", error.message);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("[getReadingsBySession] Unexpected error:", err);
    return [];
  }
}

/**
 * Hash an IP address for privacy-safe storage.
 * Uses a simple non-reversible hash (not crypto-grade, just for analytics).
 */
export function hashIp(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `ip_${Math.abs(hash).toString(36)}`;
}
