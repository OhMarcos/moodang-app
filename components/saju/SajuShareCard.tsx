"use client";

import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import type { SajuReading } from "@/lib/saju/types";
import type { Locale } from "@/lib/i18n/translations";

interface SajuShareCardProps {
  reading: SajuReading;
  name: string;
  locale: Locale;
}

export interface SajuCardHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

const C = {
  bg: "#0a1628",
  card: "#1e293b",
  purple: "#7c3aed",
  purpleLight: "#a78bfa",
  purpleDim: "#5b21b6",
  gold: "#d4a574",
  goldLight: "#e8c9a0",
  teal: "#5eead4",
  ivory: "#e2e8f0",
  muted: "#94a3b8",
  border: "#334155",
  red: "#dc2626",
};

const SIZE = 1080;
const PAD = 40;

const GRADE_COLORS: Record<string, string> = {
  SSS: "#fbbf24",
  SS: "#f59e0b",
  S: "#a78bfa",
  A: "#60a5fa",
  B: "#34d399",
  C: "#94a3b8",
};

const FORTUNE_LABELS: Record<Locale, { key: string; label: string; emoji: string }[]> = {
  ko: [
    { key: "wealth", label: "재물", emoji: "💰" },
    { key: "love", label: "연애", emoji: "❤" },
    { key: "career", label: "직업", emoji: "🎯" },
    { key: "health", label: "건강", emoji: "💪" },
    { key: "fame", label: "명예", emoji: "👑" },
  ],
  en: [
    { key: "wealth", label: "Wealth", emoji: "💰" },
    { key: "love", label: "Love", emoji: "❤" },
    { key: "career", label: "Career", emoji: "🎯" },
    { key: "health", label: "Health", emoji: "💪" },
    { key: "fame", label: "Fame", emoji: "👑" },
  ],
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCard(ctx: CanvasRenderingContext2D, reading: SajuReading, name: string, locale: Locale) {
  const s = SIZE;
  const labels = FORTUNE_LABELS[locale];
  const isEn = locale === "en";

  // Background
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, s, s);

  // Radial purple glow
  const glow = ctx.createRadialGradient(s / 2, s * 0.32, 0, s / 2, s * 0.32, s * 0.45);
  glow.addColorStop(0, "rgba(124, 58, 237, 0.12)");
  glow.addColorStop(1, "rgba(124, 58, 237, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, s, s);

  // Outer purple frame
  const fi = 16;
  roundRect(ctx, fi, fi, s - fi * 2, s - fi * 2, 24);
  ctx.strokeStyle = C.purple;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Inner frame
  roundRect(ctx, fi + 8, fi + 8, s - (fi + 8) * 2, s - (fi + 8) * 2, 20);
  ctx.strokeStyle = `${C.purple}40`;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Corner marks
  ctx.strokeStyle = `${C.purpleLight}50`;
  ctx.lineWidth = 2;
  const cm = 36;
  ctx.beginPath(); ctx.moveTo(fi + 10, fi + cm); ctx.lineTo(fi + 10, fi + 10); ctx.lineTo(fi + cm, fi + 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(s - fi - cm, fi + 10); ctx.lineTo(s - fi - 10, fi + 10); ctx.lineTo(s - fi - 10, fi + cm); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(fi + 10, s - fi - cm); ctx.lineTo(fi + 10, s - fi - 10); ctx.lineTo(fi + cm, s - fi - 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(s - fi - cm, s - fi - 10); ctx.lineTo(s - fi - 10, s - fi - 10); ctx.lineTo(s - fi - 10, s - fi - cm); ctx.stroke();

  // Triple Lens badge
  ctx.font = `bold 14px "SF Mono", "Menlo", monospace`;
  ctx.textAlign = "center";
  ctx.fillStyle = C.teal;
  ctx.fillText(isEn ? "TRIPLE LENS — Triple Analysis" : "TRIPLE LENS — 삼중 렌즈 분석", s / 2, PAD + 40);

  // Name
  ctx.font = `500 24px "Noto Serif KR", serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = C.muted;
  ctx.fillText(isEn ? `${name}'s Destiny` : `${name}님의 운명`, s / 2, PAD + 68);

  // Large Hanja (hero visual)
  ctx.font = `bold 200px "Noto Serif KR", serif`;
  ctx.textAlign = "center";
  const hanja = reading?.destinyType?.hanja ?? "命";
  const title = reading?.destinyType?.title ?? "";
  const desc = reading?.destinyType?.description ?? "";

  ctx.fillStyle = C.purpleLight;
  ctx.globalAlpha = 0.15;
  ctx.fillText(hanja, s / 2 + 3, s * 0.35 + 3);
  ctx.globalAlpha = 1;
  const hanjaGrad = ctx.createLinearGradient(s * 0.3, s * 0.15, s * 0.7, s * 0.4);
  hanjaGrad.addColorStop(0, C.purpleLight);
  hanjaGrad.addColorStop(1, C.purple);
  ctx.fillStyle = hanjaGrad;
  ctx.fillText(hanja, s / 2, s * 0.35);

  // Destiny title
  ctx.font = `bold 34px "Noto Serif KR", serif`;
  ctx.fillStyle = C.ivory;
  ctx.fillText(title, s / 2, s * 0.42);

  // Description (truncated)
  ctx.font = `400 22px "Noto Serif KR", serif`;
  ctx.fillStyle = C.muted;
  const maxDescLen = 40;
  ctx.fillText(desc.length > maxDescLen ? desc.slice(0, maxDescLen) + "..." : desc, s / 2, s * 0.46);

  // Grade badge
  const grade = reading?.overallGrade?.grade ?? "C";
  const nationalPercentile = reading?.overallGrade?.nationalPercentile ?? 50;
  const gradeColor = GRADE_COLORS[grade] ?? C.muted;
  const gradeY = s * 0.52;
  roundRect(ctx, s / 2 - 100, gradeY - 24, 200, 48, 24);
  ctx.fillStyle = `${gradeColor}20`;
  ctx.fill();
  ctx.strokeStyle = `${gradeColor}60`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = `bold 28px "SF Mono", "Menlo", monospace`;
  ctx.fillStyle = gradeColor;
  ctx.textAlign = "center";
  ctx.fillText(grade, s / 2 - 30, gradeY + 8);

  ctx.font = `500 18px "Noto Serif KR", serif`;
  ctx.fillStyle = C.ivory;
  ctx.fillText(isEn ? `Top ${nationalPercentile}%` : `상위 ${nationalPercentile}%`, s / 2 + 40, gradeY + 6);

  // Divider
  const divY = s * 0.58;
  ctx.beginPath();
  ctx.moveTo(PAD + 40, divY);
  ctx.lineTo(s - PAD - 40, divY);
  ctx.strokeStyle = `${C.border}`;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Fortune scores (5 bars)
  const barStartY = s * 0.62;
  const barGap = 48;
  const barX = PAD + 28;
  const barW = s - (PAD + 28) * 2;

  for (let i = 0; i < labels.length; i++) {
    const { key, label, emoji } = labels[i];
    const fortune = reading?.fortunes?.[key as keyof typeof reading.fortunes];
    const score = fortune?.score ?? 50;
    const y = barStartY + i * barGap;

    // Label
    ctx.font = `bold 22px "Noto Serif KR", serif`;
    ctx.textAlign = "left";
    ctx.fillStyle = C.muted;
    ctx.fillText(`${emoji} ${label}`, barX, y + 4);

    // Score
    ctx.font = `bold 24px "SF Mono", "Menlo", monospace`;
    ctx.textAlign = "right";
    ctx.fillStyle = score >= 80 ? C.purpleLight : score >= 60 ? C.muted : C.red;
    ctx.fillText(`${score}`, barX + barW, y + 4);

    // Bar
    const bx = barX + 120;
    const bw = barW - 190;
    const by = y - 8;
    const bh = 26;
    roundRect(ctx, bx, by, bw, bh, 5);
    ctx.fillStyle = C.border;
    ctx.fill();

    const fillW = Math.max(6, (score / 100) * bw);
    roundRect(ctx, bx, by, fillW, bh, 5);
    const fg = ctx.createLinearGradient(bx, 0, bx + fillW, 0);
    fg.addColorStop(0, C.purpleDim);
    fg.addColorStop(1, C.purpleLight);
    ctx.fillStyle = fg;
    ctx.fill();
  }

  // Triple Convergence verdict
  const convY = barStartY + labels.length * barGap + 8;
  if (reading?.quadConvergence) {
    const verdictLabel = reading.quadConvergence?.energyVerdictKr ?? "";
    const agreement = reading.quadConvergence?.agreementLevel ?? 0;

    // Verdict badge
    roundRect(ctx, s / 2 - 160, convY - 14, 320, 40, 20);
    ctx.fillStyle = `${C.teal}15`;
    ctx.fill();
    ctx.strokeStyle = `${C.teal}40`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = `bold 20px "Noto Serif KR", serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = C.teal;
    ctx.fillText(
      isEn
        ? `${verdictLabel}  ·  ${agreement}/3 systems agree`
        : `${verdictLabel}  ·  ${agreement}/3 시스템 일치`,
      s / 2, convY + 12,
    );
  }

  // Watermark
  ctx.font = `bold 18px sans-serif`;
  ctx.textAlign = "right";
  ctx.fillStyle = `${C.purpleLight}60`;
  ctx.fillText("moodang.app", s - PAD - 14, s - PAD + 2);
}

const SajuShareCard = forwardRef<SajuCardHandle, SajuShareCardProps>(
  function SajuShareCard({ reading, name, locale }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isReady, setIsReady] = useState(false);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = SIZE;
      canvas.height = SIZE;
      drawCard(ctx, reading, name, locale);
      setIsReady(true);
    }, [reading, name, locale]);

    return (
      <div className="relative w-full max-w-md mx-auto">
        <canvas
          ref={canvasRef}
          className={`w-full rounded-xl border border-[var(--color-border)] transition-opacity duration-500 ${isReady ? "opacity-100" : "opacity-0"}`}
        />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-card)] rounded-xl">
            <p className="text-sm text-[var(--color-text-secondary)] animate-pulse-gold">
              {locale === "en" ? "Generating destiny card..." : "운명 카드 생성 중..."}
            </p>
          </div>
        )}
      </div>
    );
  },
);

export default SajuShareCard;
