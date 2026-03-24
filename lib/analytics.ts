/**
 * Moodang custom analytics events.
 *
 * All events are prefixed with the feature area for easy filtering in PostHog.
 * Usage: import { track } from "@/lib/analytics"; track.gwansangStarted();
 */
import posthog from "posthog-js";

function capture(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}

export const track = {
  // ─── Gwansang (관상) funnel ───
  gwansangPageViewed: () =>
    capture("gwansang_page_viewed"),

  gwansangPhotoTaken: () =>
    capture("gwansang_photo_taken"),

  gwansangAnalysisStarted: () =>
    capture("gwansang_analysis_started"),

  gwansangAnalysisCompleted: (props: {
    nickname?: string;
    sexAppeal?: number;
    sharpMind?: number;
    wealthPotential?: number;
  }) =>
    capture("gwansang_analysis_completed", props),

  gwansangAnalysisFailed: (error: string) =>
    capture("gwansang_analysis_failed", { error }),

  // ─── Saju (사주) funnel ───
  sajuPageViewed: () =>
    capture("saju_page_viewed"),

  sajuFormSubmitted: (props: { gender: string; calendarType: string }) =>
    capture("saju_form_submitted", props),

  sajuAnalysisStarted: () =>
    capture("saju_analysis_started"),

  sajuAnalysisCompleted: (props: {
    destinyType?: string;
    grade?: string;
    cached?: boolean;
  }) =>
    capture("saju_analysis_completed", props),

  sajuAnalysisFailed: (error: string) =>
    capture("saju_analysis_failed", { error }),

  // ─── Sharing ───
  shareImageSaved: (type: "gwansang" | "saju") =>
    capture("share_image_saved", { type }),

  shareNativeUsed: (type: "gwansang" | "saju") =>
    capture("share_native_used", { type }),

  shareLinkCopied: (type: "gwansang" | "saju") =>
    capture("share_link_copied", { type }),

  // ─── Share page (inbound) ───
  sharePageViewed: (props: { type: string; referrer?: string }) =>
    capture("share_page_viewed", props),

  sharePageCtaClicked: (type: string) =>
    capture("share_page_cta_clicked", { type }),

  // ─── Engagement ───
  resultSectionViewed: (section: string) =>
    capture("result_section_viewed", { section }),

  resetClicked: (type: "gwansang" | "saju") =>
    capture("reset_clicked", { type }),

  // ─── Rate limiting / errors ───
  rateLimitHit: (type: "gwansang" | "saju") =>
    capture("rate_limit_hit", { type }),

  dailyCapHit: () =>
    capture("daily_cap_hit"),
};
