"use client";

import { useState, type RefObject } from "react";
import {
  shareCardImage,
  downloadCardImage,
  copyShareLink,
  generateShareUrl,
  trackShareEvent,
} from "@/lib/sharing";
import { track } from "@/lib/analytics";

interface ShareButtonsProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  type: "gwansang" | "saju";
  nickname?: string;
  /** Accent color CSS variable name */
  accent?: string;
  /** DB reading ID for persistent sharing and tracking */
  readingId?: string | null;
}

type FeedbackState = "idle" | "saved" | "shared" | "copied";

export default function ShareButtons({
  canvasRef,
  type,
  nickname,
  accent = "var(--color-sacred-gold)",
  readingId,
}: ShareButtonsProps) {
  const [feedback, setFeedback] = useState<FeedbackState>("idle");

  const flash = (state: FeedbackState) => {
    setFeedback(state);
    setTimeout(() => setFeedback("idle"), 2000);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ok = downloadCardImage(canvas, `moodang-${type}.png`);
    if (ok) {
      track.shareImageSaved(type);
      if (readingId) trackShareEvent(readingId, "download");
      flash("saved");
    }
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = generateShareUrl({ type, nickname, readingId });
    const text = `${nickname ? `"${nickname}" — ` : ""}${type === "gwansang" ? "AI 관상 분석" : "사주팔자 분석"} 결과\n나도 해보기 → ${url}`;
    const ok = await shareCardImage(canvas, text);
    if (ok) {
      track.shareNativeUsed(type);
      if (readingId) trackShareEvent(readingId, "native");
      flash("shared");
    }
  };

  const handleCopyLink = async () => {
    const url = generateShareUrl({ type, nickname, readingId });
    const ok = await copyShareLink(url);
    if (ok) {
      track.shareLinkCopied(type);
      if (readingId) trackShareEvent(readingId, "link");
      flash("copied");
    }
  };

  const feedbackLabel: Record<FeedbackState, string> = {
    idle: "",
    saved: "저장됨!",
    shared: "공유됨!",
    copied: "복사됨!",
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {/* Save Image */}
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-primary)] hover:border-[var(--color-border-accent)] transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {feedback === "saved" ? "저장됨!" : "이미지 저장"}
        </button>

        {/* Share (Web Share API) */}
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition hover:brightness-110"
          style={{ backgroundColor: accent }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Z" />
          </svg>
          {feedback === "shared" ? "공유됨!" : "공유하기"}
        </button>
      </div>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.363-3.068a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364l1.757 1.757" />
        </svg>
        {feedback === "copied" ? "링크 복사됨!" : "링크 복사"}
      </button>
    </div>
  );
}
