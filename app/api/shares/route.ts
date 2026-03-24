import { NextRequest, NextResponse } from "next/server";
import { trackShare, findRecentShare } from "@/lib/database/shares";
import { isSupabaseConfigured } from "@/lib/database/supabase";

/**
 * POST /api/shares — Track a share event.
 * Body: { readingId: string, platform: string }
 */
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, shareId: null });
  }

  try {
    const { readingId, platform } = await request.json();

    if (!readingId || !platform) {
      return NextResponse.json(
        { error: "readingId and platform are required" },
        { status: 400 },
      );
    }

    // Deduplicate: skip if same reading+platform shared within 5 minutes
    const recent = await findRecentShare(readingId, platform);
    if (recent) {
      return NextResponse.json({ ok: true, shareId: recent.id });
    }

    const shareId = await trackShare(readingId, platform);
    return NextResponse.json({ ok: true, shareId });
  } catch (error) {
    console.error("[/api/shares] Error:", error);
    return NextResponse.json({ ok: true, shareId: null });
  }
}
