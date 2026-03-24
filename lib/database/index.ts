export { getServerSupabase, getBrowserSupabase, isSupabaseConfigured } from "./supabase";
export { saveReading, getReading, getReadingsBySession, hashIp } from "./readings";
export { trackShare, trackClick, getSharesByReading } from "./shares";
export type { Database, ReadingRow, ShareRow, DailyStatsRow } from "./types";
