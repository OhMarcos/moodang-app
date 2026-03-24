/**
 * Database types for Supabase.
 * Manually defined for Phase 1 tables.
 * Can be replaced with auto-generated types via `supabase gen types` later.
 */

export interface Database {
  public: {
    Tables: {
      readings: {
        Row: ReadingRow;
        Insert: ReadingInsert;
        Update: Partial<ReadingInsert>;
      };
      shares: {
        Row: ShareRow;
        Insert: ShareInsert;
        Update: Partial<ShareInsert>;
      };
      share_clicks: {
        Row: ShareClickRow;
        Insert: ShareClickInsert;
        Update: Partial<ShareClickInsert>;
      };
      daily_stats: {
        Row: DailyStatsRow;
        Insert: DailyStatsInsert;
        Update: Partial<DailyStatsInsert>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ─── readings ───

export interface ReadingRow {
  id: string;
  session_id: string;
  reading_type: "saju" | "gwansang";
  input_data: Record<string, unknown>;
  precomputed_data: Record<string, unknown> | null;
  ai_result: Record<string, unknown>;
  fortune_grade: string | null;
  destiny_type_hanja: string | null;
  day_master: string | null;
  celebrity_match: string | null;
  ip_hash: string | null;
  created_at: string;
}

export interface ReadingInsert {
  id?: string;
  session_id: string;
  reading_type: "saju" | "gwansang";
  input_data: Record<string, unknown>;
  precomputed_data?: Record<string, unknown> | null;
  ai_result: Record<string, unknown>;
  fortune_grade?: string | null;
  destiny_type_hanja?: string | null;
  day_master?: string | null;
  celebrity_match?: string | null;
  ip_hash?: string | null;
}

// ─── shares ───

export interface ShareRow {
  id: string;
  reading_id: string;
  share_platform: string;
  share_url: string | null;
  click_count: number;
  created_at: string;
}

export interface ShareInsert {
  id?: string;
  reading_id: string;
  share_platform: string;
  share_url?: string | null;
  click_count?: number;
}

// ─── share_clicks ───

export interface ShareClickRow {
  id: string;
  share_id: string;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface ShareClickInsert {
  id?: string;
  share_id: string;
  referrer?: string | null;
  user_agent?: string | null;
}

// ─── daily_stats ───

export interface DailyStatsRow {
  date: string;
  total_readings: number;
  saju_count: number;
  gwansang_count: number;
  total_shares: number;
  unique_sessions: number;
  grade_distribution: Record<string, number> | null;
  top_destiny_types: Array<{ hanja: string; count: number }> | null;
  updated_at: string;
}

export interface DailyStatsInsert {
  date: string;
  total_readings?: number;
  saju_count?: number;
  gwansang_count?: number;
  total_shares?: number;
  unique_sessions?: number;
  grade_distribution?: Record<string, number> | null;
  top_destiny_types?: Array<{ hanja: string; count: number }> | null;
}
