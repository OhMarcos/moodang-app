import { getServerSupabase, isSupabaseConfigured } from "./supabase";
import type { ShareRow } from "./types";

/**
 * Track a share event.
 * Returns the share ID on success, null if DB is not configured.
 */
export async function trackShare(
  readingId: string,
  platform: string,
  shareUrl?: string,
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("shares")
      .insert({
        reading_id: readingId,
        share_platform: platform,
        share_url: shareUrl ?? null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[trackShare] Supabase insert error:", error.message);
      return null;
    }

    return data.id;
  } catch (err) {
    console.error("[trackShare] Unexpected error:", err);
    return null;
  }
}

/**
 * Track a click on a shared link.
 * Also increments the click_count on the share.
 */
export async function trackClick(
  shareId: string,
  referrer?: string,
  userAgent?: string,
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    const supabase = getServerSupabase();

    // Insert click record and increment counter in parallel
    await Promise.all([
      supabase.from("share_clicks").insert({
        share_id: shareId,
        referrer: referrer ?? null,
        user_agent: userAgent ?? null,
      }),
      supabase.rpc("increment_click_count", { share_id_param: shareId }),
    ]);
  } catch (err) {
    // Non-critical — don't fail the page load
    console.error("[trackClick] Error:", err);
  }
}

/**
 * Get shares for a reading (for analytics display).
 */
export async function getSharesByReading(
  readingId: string,
): Promise<ShareRow[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("shares")
      .select("*")
      .eq("reading_id", readingId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getSharesByReading] Supabase query error:", error.message);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("[getSharesByReading] Unexpected error:", err);
    return [];
  }
}

/**
 * Find the most recent share for a reading on a specific platform.
 * Used to avoid duplicate share tracking.
 */
export async function findRecentShare(
  readingId: string,
  platform: string,
): Promise<ShareRow | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = getServerSupabase();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("shares")
      .select("*")
      .eq("reading_id", readingId)
      .eq("share_platform", platform)
      .gte("created_at", fiveMinutesAgo)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[findRecentShare] Supabase query error:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("[findRecentShare] Unexpected error:", err);
    return null;
  }
}
