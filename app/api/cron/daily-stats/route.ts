import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, isSupabaseConfigured } from "@/lib/database/supabase";
import type { DailyStatsInsert } from "@/lib/database/types";

/**
 * GET /api/cron/daily-stats — Aggregate daily statistics.
 *
 * Intended to be called by Vercel Cron (daily at midnight KST).
 * Also callable manually for testing.
 *
 * Requires CRON_SECRET header for security in production.
 */
export async function GET(request: NextRequest) {
  // Simple auth check for cron endpoint
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, reason: "Supabase not configured" });
  }

  try {
    const supabase = getServerSupabase();

    // Get yesterday's date in KST
    const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const yesterday = new Date(kstNow);
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().slice(0, 10);

    // Start and end of the target day (in UTC)
    const dayStart = new Date(`${dateStr}T00:00:00+09:00`).toISOString();
    const dayEnd = new Date(`${dateStr}T23:59:59+09:00`).toISOString();

    // Count readings
    const { count: totalReadings } = await supabase
      .from("readings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", dayStart)
      .lte("created_at", dayEnd);

    const { count: sajuCount } = await supabase
      .from("readings")
      .select("*", { count: "exact", head: true })
      .eq("reading_type", "saju")
      .gte("created_at", dayStart)
      .lte("created_at", dayEnd);

    const { count: gwansangCount } = await supabase
      .from("readings")
      .select("*", { count: "exact", head: true })
      .eq("reading_type", "gwansang")
      .gte("created_at", dayStart)
      .lte("created_at", dayEnd);

    // Count shares
    const { count: totalShares } = await supabase
      .from("shares")
      .select("*", { count: "exact", head: true })
      .gte("created_at", dayStart)
      .lte("created_at", dayEnd);

    // Grade distribution (saju only)
    const { data: gradeData } = await supabase
      .from("readings")
      .select("fortune_grade")
      .eq("reading_type", "saju")
      .not("fortune_grade", "is", null)
      .gte("created_at", dayStart)
      .lte("created_at", dayEnd);

    const gradeDistribution: Record<string, number> = {};
    for (const row of gradeData ?? []) {
      const g = row.fortune_grade ?? "unknown";
      gradeDistribution[g] = (gradeDistribution[g] ?? 0) + 1;
    }

    // Top destiny types
    const { data: destinyData } = await supabase
      .from("readings")
      .select("destiny_type_hanja")
      .eq("reading_type", "saju")
      .not("destiny_type_hanja", "is", null)
      .gte("created_at", dayStart)
      .lte("created_at", dayEnd);

    const destinyCounts: Record<string, number> = {};
    for (const row of destinyData ?? []) {
      const h = row.destiny_type_hanja ?? "";
      if (h) destinyCounts[h] = (destinyCounts[h] ?? 0) + 1;
    }
    const topDestinyTypes = Object.entries(destinyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([hanja, count]) => ({ hanja, count }));

    // Unique sessions
    const { data: sessionData } = await supabase
      .from("readings")
      .select("session_id")
      .gte("created_at", dayStart)
      .lte("created_at", dayEnd);

    const uniqueSessions = new Set(sessionData?.map((r) => r.session_id) ?? []).size;

    // Upsert daily stats
    const statsRow: DailyStatsInsert = {
      date: dateStr,
      total_readings: totalReadings ?? 0,
      saju_count: sajuCount ?? 0,
      gwansang_count: gwansangCount ?? 0,
      total_shares: totalShares ?? 0,
      unique_sessions: uniqueSessions,
      grade_distribution: gradeDistribution,
      top_destiny_types: topDestinyTypes,
    };
    const { error } = await supabase
      .from("daily_stats")
      .upsert(statsRow);

    if (error) {
      console.error("[daily-stats] Upsert error:", error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      date: dateStr,
      totalReadings: totalReadings ?? 0,
      totalShares: totalShares ?? 0,
      uniqueSessions,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[daily-stats] Error:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
