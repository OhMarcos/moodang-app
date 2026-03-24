"use client";

import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import type { GwansangReading } from "@/lib/gwansang/types";

interface FaceAnalysisOverlayProps {
  imageUrl: string;
  reading: GwansangReading;
}

export interface CardHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

/** Brand palette */
const C = {
  bg: "#0a0e1a",
  gold: "#d4a574",
  goldLight: "#e8c9a0",
  goldDim: "#a07c52",
  neon: "#c084fc",       // purple neon for Gen Z vibe
  neonDim: "#7c3aed",
  cyan: "#22d3ee",       // accent pop
  ivory: "#e2e8f0",
  muted: "#64748b",
  barBg: "#1e293b",
  red: "#ef4444",
  dark: "#0f172a",
};

const WIDTH = 1080;
const HEIGHT = 1350; // 4:5 ratio — optimal for Instagram feed
const PAD = 28;

const SCORE_LABELS: { key: string; label: string; emoji: string }[] = [
  { key: "sexAppeal", label: "색기", emoji: "🔥" },
  { key: "sharpMind", label: "총기", emoji: "🧠" },
  { key: "wealthPotential", label: "재력", emoji: "💰" },
  { key: "peopleLuck", label: "인복", emoji: "🤝" },
  { key: "mainCharacterEnergy", label: "관종력", emoji: "⭐" },
];

/** 12궁 positions relative to photo region */
const TWELVE_PALACES = [
  { id: "명궁", x: 0.50, y: 0.38 },
  { id: "관록궁", x: 0.50, y: 0.22 },
  { id: "복덕궁", x: 0.50, y: 0.12 },
  { id: "형제궁", x: 0.36, y: 0.35 },
  { id: "전택궁", x: 0.36, y: 0.42 },
  { id: "처첩궁", x: 0.72, y: 0.44 },
  { id: "재백궁", x: 0.50, y: 0.54 },
  { id: "질액궁", x: 0.50, y: 0.46 },
  { id: "천이궁", x: 0.20, y: 0.24 },
  { id: "남녀궁", x: 0.39, y: 0.52 },
  { id: "노복궁", x: 0.50, y: 0.84 },
  { id: "상모궁", x: 0.14, y: 0.44 },
];

/** 오관 labels */
const FIVE_FEATURES = [
  { id: "보수관", x: 0.66, y: 0.35, desc: "눈썹" },
  { id: "감찰관", x: 0.66, y: 0.42, desc: "눈" },
  { id: "심판관", x: 0.63, y: 0.54, desc: "코" },
  { id: "출납관", x: 0.63, y: 0.70, desc: "입" },
  { id: "채청관", x: 0.88, y: 0.44, desc: "귀" },
];

/** 삼정 horizontal division lines */
const THREE_COURTS = [
  { y: 0.06, label: "상정" },
  { y: 0.34, label: "중정" },
  { y: 0.64, label: "하정" },
];

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
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

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  baseFontSize: number,
  minFontSize: number,
  fontWeight: string,
): number {
  let fontSize = baseFontSize;
  while (fontSize > minFontSize) {
    ctx.font = `${fontWeight} ${fontSize}px "Noto Serif KR", serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    fontSize -= 1;
  }
  return fontSize;
}

/** Cyberpunk-mystical duotone filter — purple/gold tint + high contrast + grain */
function applyMysticFilter(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
) {
  const imageData = ctx.getImageData(x, y, w, h);
  const d = imageData.data;

  for (let i = 0; i < d.length; i += 4) {
    // Luminance
    const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];

    // Duotone: shadows → deep purple, highlights → warm gold
    const t = lum / 255;
    // Shadow color: #1a0a2e (26, 10, 46)  Highlight color: #e8c9a0 (232, 201, 160)
    d[i]     = Math.round(26 * (1 - t) + 232 * t);   // R
    d[i + 1] = Math.round(10 * (1 - t) + 201 * t);   // G
    d[i + 2] = Math.round(46 * (1 - t) + 160 * t);   // B

    // Boost contrast
    d[i]     = Math.min(255, Math.max(0, (d[i] - 128) * 1.25 + 128));
    d[i + 1] = Math.min(255, Math.max(0, (d[i + 1] - 128) * 1.25 + 128));
    d[i + 2] = Math.min(255, Math.max(0, (d[i + 2] - 128) * 1.25 + 128));

    // Film grain (subtle random noise)
    const grain = (Math.random() - 0.5) * 18;
    d[i]     = Math.min(255, Math.max(0, d[i] + grain));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + grain));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + grain));
  }

  ctx.putImageData(imageData, x, y);
}

/** Draw face annotations with neon glow style (12궁, 삼정, 오관) */
function drawFaceAnnotations(
  ctx: CanvasRenderingContext2D,
  photoX: number, photoY: number, photoW: number, photoH: number,
) {
  ctx.save();

  // ─── Face oval outline (neon glow) ───
  ctx.save();
  ctx.shadowColor = C.neon;
  ctx.shadowBlur = 12;
  ctx.strokeStyle = `${C.neon}50`;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 5]);
  ctx.beginPath();
  ctx.ellipse(
    photoX + photoW * 0.50,
    photoY + photoH * 0.46,
    photoW * 0.28,
    photoH * 0.42,
    0, 0, Math.PI * 2,
  );
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // ─── 삼정 horizontal lines ───
  ctx.strokeStyle = `${C.cyan}30`;
  ctx.lineWidth = 0.8;
  for (const court of THREE_COURTS) {
    const cy = photoY + court.y * photoH;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(photoX + photoW * 0.22, cy);
    ctx.lineTo(photoX + photoW * 0.78, cy);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.font = `bold 13px sans-serif`;
    ctx.fillStyle = `${C.cyan}88`;
    ctx.textAlign = "right";
    ctx.fillText(court.label, photoX + photoW * 0.20, cy + 4);
  }
  ctx.setLineDash([]);

  // ─── 12궁 markers (neon dots + glass badges) ───
  for (const palace of TWELVE_PALACES) {
    const px = photoX + palace.x * photoW;
    const py = photoY + palace.y * photoH;

    // Neon glow dot
    ctx.save();
    ctx.shadowColor = C.neon;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fillStyle = C.neon;
    ctx.fill();
    ctx.restore();

    // Outer ring
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.strokeStyle = `${C.neon}40`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Glass badge
    ctx.font = `bold 10px sans-serif`;
    const tw = ctx.measureText(palace.id).width;
    const bw = tw + 8;
    const bh = 15;
    const bx = px - bw / 2;
    const by = py - 18;

    roundRect(ctx, bx, by, bw, bh, 4);
    ctx.fillStyle = "rgba(124, 58, 237, 0.45)";
    ctx.fill();
    ctx.strokeStyle = `${C.neon}50`;
    ctx.lineWidth = 0.6;
    ctx.stroke();

    ctx.fillStyle = "#e0d0ff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(palace.id, px, by + bh / 2);
  }

  // ─── 오관 labels (right side connectors) ───
  for (const feat of FIVE_FEATURES) {
    const fx = photoX + feat.x * photoW;
    const fy = photoY + feat.y * photoH;

    // Connector line (neon)
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + 22, fy);
    ctx.strokeStyle = `${C.cyan}50`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Label badge
    const label = `${feat.id}(${feat.desc})`;
    ctx.font = `bold 9px sans-serif`;
    const tw = ctx.measureText(label).width;
    const lx = fx + 24;

    roundRect(ctx, lx - 2, fy - 8, tw + 6, 16, 3);
    ctx.fillStyle = "rgba(34, 211, 238, 0.25)";
    ctx.fill();

    ctx.fillStyle = `${C.cyan}dd`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(label, lx + 1, fy);
  }

  ctx.restore();
}

function findTopScore(scores: Record<string, number>): { key: string; value: number } {
  let topKey = "sexAppeal";
  let topVal = 0;
  for (const [k, v] of Object.entries(scores)) {
    if (v > topVal) { topKey = k; topVal = v; }
  }
  return { key: topKey, value: topVal };
}

/**
 * Instagram share card — 1080×1350 (4:5)
 * 1:1 photo + compact score bars + CTA
 */
function drawCard(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  reading: GwansangReading,
) {
  // ─── Background (deep space gradient) ───
  const bgGrad = ctx.createRadialGradient(WIDTH / 2, HEIGHT * 0.3, 0, WIDTH / 2, HEIGHT * 0.3, HEIGHT * 0.8);
  bgGrad.addColorStop(0, "#1a0a2e");
  bgGrad.addColorStop(0.5, "#0e0a1e");
  bgGrad.addColorStop(1, C.bg);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ─── Corner marks ───
  const cm = 40;
  const fi = 18;
  ctx.strokeStyle = `${C.gold}50`;
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(fi, fi + cm); ctx.lineTo(fi, fi); ctx.lineTo(fi + cm, fi); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(WIDTH - fi - cm, fi); ctx.lineTo(WIDTH - fi, fi); ctx.lineTo(WIDTH - fi, fi + cm); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(fi, HEIGHT - fi - cm); ctx.lineTo(fi, HEIGHT - fi); ctx.lineTo(fi + cm, HEIGHT - fi); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(WIDTH - fi - cm, HEIGHT - fi); ctx.lineTo(WIDTH - fi, HEIGHT - fi); ctx.lineTo(WIDTH - fi, HEIGHT - fi - cm); ctx.stroke();

  // ─── Photo region (1:1 square) ───
  const photoX = PAD;
  const photoY = PAD;
  const photoW = WIDTH - PAD * 2;
  const photoH = photoW; // 1:1

  ctx.save();
  roundRect(ctx, photoX, photoY, photoW, photoH, 20);
  ctx.clip();

  // Draw center-cropped image
  const imgSize = Math.min(img.width, img.height);
  const sx = (img.width - imgSize) / 2;
  const sy = (img.height - imgSize) / 2;
  ctx.drawImage(img, sx, sy, imgSize, imgSize, photoX, photoY, photoW, photoH);

  // Duotone mystic filter
  applyMysticFilter(ctx, photoX, photoY, photoW, photoH);

  // Face annotations (12궁/삼정/오관)
  drawFaceAnnotations(ctx, photoX, photoY, photoW, photoH);

  // Bottom gradient fade
  const fadeGrad = ctx.createLinearGradient(0, photoY + photoH * 0.65, 0, photoY + photoH);
  fadeGrad.addColorStop(0, "rgba(10, 14, 26, 0)");
  fadeGrad.addColorStop(1, "rgba(10, 14, 26, 0.95)");
  ctx.fillStyle = fadeGrad;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  ctx.restore();

  // ─── "AI 관상" tag (top-left) ───
  ctx.save();
  ctx.shadowColor = C.neon;
  ctx.shadowBlur = 8;
  ctx.font = `bold 18px sans-serif`;
  ctx.textAlign = "left";
  ctx.fillStyle = C.neon;
  ctx.fillText("AI 관상", photoX + 22, photoY + 38);
  ctx.restore();

  // Face shape label (top-right)
  const shapeText = reading.faceShape.split(" ")[0];
  ctx.font = `bold 18px "Noto Serif KR", serif`;
  ctx.textAlign = "right";
  ctx.fillStyle = `${C.gold}99`;
  ctx.fillText(shapeText, photoX + photoW - 22, photoY + 38);

  // ─── Hero nickname (overlapping photo bottom) ───
  const nickname = reading.funTags?.nickname ?? "관상 분석";
  const nickText = `"${nickname}"`;
  const maxNickW = photoW - 80;
  const nickSize = fitText(ctx, nickText, maxNickW, 52, 28, "bold");
  ctx.font = `bold ${nickSize}px "Noto Serif KR", serif`;
  ctx.textAlign = "center";
  ctx.save();
  ctx.shadowColor = C.gold;
  ctx.shadowBlur = 30;
  ctx.fillStyle = C.goldLight;
  ctx.fillText(nickText, WIDTH / 2, photoY + photoH - 24);
  ctx.restore();

  // ─── Score section ───
  const scores = reading.viralScores ?? {
    sexAppeal: 50, sharpMind: 50, wealthPotential: 50,
    peopleLuck: 50, mainCharacterEnergy: 50,
  };
  const scoresMap = scores as unknown as Record<string, number>;
  const topScore = findTopScore(scoresMap);

  const scoreStartY = photoY + photoH + 24;
  const barX = PAD + 12;
  const barTotalW = WIDTH - (PAD + 12) * 2;
  const barH = 18;
  const rowGap = 42;

  for (let i = 0; i < SCORE_LABELS.length; i++) {
    const { key, label, emoji } = SCORE_LABELS[i];
    const value = scoresMap[key] ?? 50;
    const y = scoreStartY + i * rowGap;
    const isTop = key === topScore.key;

    // Label
    ctx.font = `bold ${isTop ? 22 : 19}px "Noto Serif KR", serif`;
    ctx.textAlign = "left";
    ctx.fillStyle = isTop ? C.goldLight : C.muted;
    ctx.fillText(`${emoji} ${label}`, barX, y + 4);

    // Score number
    ctx.font = `bold ${isTop ? 28 : 23}px "SF Mono", "Menlo", monospace`;
    ctx.textAlign = "right";
    ctx.fillStyle = isTop ? C.goldLight : value >= 70 ? C.gold : value >= 40 ? C.muted : C.red;
    if (isTop) {
      ctx.save();
      ctx.shadowColor = C.gold;
      ctx.shadowBlur = 12;
      ctx.fillText(`${value}`, barX + barTotalW, y + 4);
      ctx.restore();
    } else {
      ctx.fillText(`${value}`, barX + barTotalW, y + 4);
    }

    // Bar track
    const trackX = barX + 110;
    const trackEndX = barX + barTotalW - 60;
    const trackW = trackEndX - trackX;
    const by = y - 6;

    roundRect(ctx, trackX, by, trackW, barH, barH / 2);
    ctx.fillStyle = C.barBg;
    ctx.fill();

    // Bar fill
    const fillW = Math.max(barH, (value / 100) * trackW);
    roundRect(ctx, trackX, by, fillW, barH, barH / 2);

    const barGrad = ctx.createLinearGradient(trackX, 0, trackX + fillW, 0);
    if (isTop) {
      barGrad.addColorStop(0, C.neonDim);
      barGrad.addColorStop(1, C.neon);
    } else if (value >= 70) {
      barGrad.addColorStop(0, C.goldDim);
      barGrad.addColorStop(1, C.gold);
    } else if (value >= 40) {
      barGrad.addColorStop(0, "#334155");
      barGrad.addColorStop(1, C.muted);
    } else {
      barGrad.addColorStop(0, "#7f1d1d");
      barGrad.addColorStop(1, C.red);
    }

    if (isTop) {
      ctx.save();
      ctx.shadowColor = C.neon;
      ctx.shadowBlur = 14;
      ctx.fillStyle = barGrad;
      ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = barGrad;
      ctx.fill();
    }
  }

  // ─── CTA ───
  const ctaY = HEIGHT - PAD - 18;

  // Separator line
  ctx.save();
  ctx.shadowColor = C.neon;
  ctx.shadowBlur = 6;
  ctx.strokeStyle = `${C.neon}30`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD + 100, ctaY - 24);
  ctx.lineTo(WIDTH - PAD - 100, ctaY - 24);
  ctx.stroke();
  ctx.restore();

  ctx.font = `bold 22px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = `${C.gold}cc`;
  ctx.fillText("내 관상 능력치는?  👀  moodang.app", WIDTH / 2, ctaY);
}

const FaceAnalysisOverlay = forwardRef<CardHandle, FaceAnalysisOverlayProps>(
  function FaceAnalysisOverlay({ imageUrl, reading }, ref) {
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

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        drawCard(ctx, img, reading);
        setIsReady(true);
      };

      img.src = imageUrl;
    }, [imageUrl, reading]);

    return (
      <div className="relative w-full max-w-md mx-auto">
        <canvas
          ref={canvasRef}
          className={`w-full rounded-xl border border-[var(--color-border)] transition-opacity duration-500 ${isReady ? "opacity-100" : "opacity-0"}`}
        />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-card)] rounded-xl">
            <p className="text-sm text-[var(--color-text-secondary)] animate-pulse-gold">
              카드 생성 중...
            </p>
          </div>
        )}
      </div>
    );
  },
);

export default FaceAnalysisOverlay;
