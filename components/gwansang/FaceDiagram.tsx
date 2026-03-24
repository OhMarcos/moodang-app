"use client";

import { useRef, useEffect, useState } from "react";
import type { GwansangReading } from "@/lib/gwansang/types";

interface FaceDiagramProps {
  imageUrl: string;
  reading: GwansangReading;
}

/** Standard face proportion ratios */
const FACE = {
  left: 0.2,
  top: 0.08,
  width: 0.6,
  height: 0.84,
};

/** 12궁 positions relative to face bounding box */
const TWELVE_PALACES = [
  { id: "명궁", x: 0.5, y: 0.36, desc: "命宮" },
  { id: "관록궁", x: 0.5, y: 0.2, desc: "官祿" },
  { id: "복덕궁", x: 0.5, y: 0.1, desc: "福德" },
  { id: "형제궁", x: 0.35, y: 0.33, desc: "兄弟" },
  { id: "전택궁", x: 0.35, y: 0.4, desc: "田宅" },
  { id: "처첩궁", x: 0.72, y: 0.42, desc: "妻妾" },
  { id: "재백궁", x: 0.5, y: 0.52, desc: "財帛" },
  { id: "질액궁", x: 0.5, y: 0.44, desc: "疾厄" },
  { id: "천이궁", x: 0.18, y: 0.22, desc: "遷移" },
  { id: "남녀궁", x: 0.38, y: 0.5, desc: "男女" },
  { id: "노복궁", x: 0.5, y: 0.82, desc: "奴僕" },
  { id: "상모궁", x: 0.12, y: 0.42, desc: "相貌" },
];

/** 삼정 horizontal division lines */
const THREE_COURTS = [
  { y: 0.05, label: "상정(上停)" },
  { y: 0.32, label: "중정(中停)" },
  { y: 0.62, label: "하정(下停)" },
  { y: 0.95, label: "" },
];

/** 오관 feature labels */
const FIVE_FEATURES = [
  { id: "보수관", x: 0.65, y: 0.33, desc: "눈썹" },
  { id: "감찰관", x: 0.65, y: 0.4, desc: "눈" },
  { id: "심판관", x: 0.62, y: 0.52, desc: "코" },
  { id: "출납관", x: 0.62, y: 0.68, desc: "입" },
  { id: "채청관", x: 0.88, y: 0.42, desc: "귀" },
];

function drawRoundedRect(
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

/** 수묵화 style filter */
function applyTraditionalFilter(ctx: CanvasRenderingContext2D, size: number) {
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  const grayValues = new Uint8Array(size * size);

  for (let i = 0; i < data.length; i += 4) {
    let lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    grayValues[i / 4] = Math.round(lum);
    lum = Math.round(lum / 18) * 18;
    const mix = 0.75;
    data[i]     = Math.min(255, lum * (1 - mix) + (lum + 28) * mix);
    data[i + 1] = Math.min(255, lum * (1 - mix) + (lum + 5) * mix);
    data[i + 2] = Math.min(255, lum * (1 - mix) + (lum - 22) * mix);
    data[i]     = Math.min(255, Math.max(0, (data[i] - 128) * 1.4 + 128));
    data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.4 + 128));
    data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.4 + 128));
  }
  ctx.putImageData(imageData, 0, 0);

  // Edge enhancement
  const edgeData = ctx.getImageData(0, 0, size, size);
  const ed = edgeData.data;
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const idx = y * size + x;
      const center = grayValues[idx];
      const edgeStrength =
        (Math.abs(center - grayValues[idx - 1]) +
         Math.abs(center - grayValues[idx + 1]) +
         Math.abs(center - grayValues[idx - size]) +
         Math.abs(center - grayValues[idx + size])) / 4;
      if (edgeStrength > 12) {
        const darken = Math.min(0.7, (edgeStrength / 55) * 0.7);
        const pi = idx * 4;
        ed[pi]     = Math.round(ed[pi] * (1 - darken));
        ed[pi + 1] = Math.round(ed[pi + 1] * (1 - darken));
        ed[pi + 2] = Math.round(ed[pi + 2] * (1 - darken));
      }
    }
  }
  ctx.putImageData(edgeData, 0, 0);

  // Paper grain
  const grainData = ctx.getImageData(0, 0, size, size);
  const gd = grainData.data;
  for (let i = 0; i < gd.length; i += 4) {
    const noise = (Math.random() - 0.5) * 22;
    gd[i]     = Math.min(255, Math.max(0, gd[i] + noise));
    gd[i + 1] = Math.min(255, Math.max(0, gd[i + 1] + noise));
    gd[i + 2] = Math.min(255, Math.max(0, gd[i + 2] + noise));
  }
  ctx.putImageData(grainData, 0, 0);

  // Vignette
  const gradient = ctx.createRadialGradient(size / 2, size / 2, size * 0.22, size / 2, size / 2, size * 0.65);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(0.6, "rgba(0, 0, 0, 0.18)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.55)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Warm overlay
  ctx.fillStyle = "rgba(210, 190, 160, 0.06)";
  ctx.fillRect(0, 0, size, size);

  // Brush strokes
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = "#8B7633";
  ctx.lineWidth = 0.7;
  for (let i = 0; i < 100; i++) {
    const sy = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(0, sy);
    ctx.bezierCurveTo(size * 0.3, sy + (Math.random() - 0.5) * 12, size * 0.7, sy + (Math.random() - 0.5) * 12, size, sy + (Math.random() - 0.5) * 8);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.03;
  ctx.strokeStyle = "#5A4422";
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 40; i++) {
    const sx = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.bezierCurveTo(sx + (Math.random() - 0.5) * 10, size * 0.3, sx + (Math.random() - 0.5) * 10, size * 0.7, sx + (Math.random() - 0.5) * 6, size);
    ctx.stroke();
  }
  ctx.restore();
}

export default function FaceDiagram({ imageUrl, reading }: FaceDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const canvasSize = 600;
      canvas.width = canvasSize;
      canvas.height = canvasSize;

      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      ctx.drawImage(img, sx, sy, size, size, 0, 0, canvasSize, canvasSize);

      applyTraditionalFilter(ctx, canvasSize);

      const faceX = FACE.left * canvasSize;
      const faceY = FACE.top * canvasSize;
      const faceW = FACE.width * canvasSize;
      const faceH = FACE.height * canvasSize;

      // Face outline (oval)
      ctx.save();
      ctx.strokeStyle = "rgba(201, 168, 76, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.ellipse(faceX + faceW / 2, faceY + faceH * 0.48, faceW * 0.48, faceH * 0.48, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 삼정 horizontal lines
      ctx.save();
      ctx.strokeStyle = "rgba(201, 168, 76, 0.4)";
      ctx.lineWidth = 1;
      for (let i = 0; i < THREE_COURTS.length; i++) {
        const court = THREE_COURTS[i];
        const y = faceY + court.y * faceH;
        ctx.setLineDash([6, 3]);
        ctx.beginPath();
        ctx.moveTo(faceX + faceW * 0.05, y);
        ctx.lineTo(faceX + faceW * 0.95, y);
        ctx.stroke();
        if (court.label) {
          ctx.font = "bold 11px 'Noto Serif KR', serif";
          ctx.fillStyle = "rgba(201, 168, 76, 0.9)";
          ctx.textAlign = "right";
          ctx.fillText(court.label, faceX - 4, y + 4);
        }
      }
      ctx.setLineDash([]);
      ctx.restore();

      // Vertical center line
      ctx.save();
      ctx.strokeStyle = "rgba(201, 168, 76, 0.2)";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(faceX + faceW / 2, faceY);
      ctx.lineTo(faceX + faceW / 2, faceY + faceH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 12궁 markers
      ctx.save();
      for (const palace of TWELVE_PALACES) {
        const px = faceX + palace.x * faceW;
        const py = faceY + palace.y * faceH;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(201, 168, 76, 0.8)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(201, 168, 76, 0.4)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        const labelText = palace.id;
        ctx.font = "bold 9px 'Noto Serif KR', serif";
        const textWidth = ctx.measureText(labelText).width;
        const badgeW = textWidth + 8;
        const badgeH = 14;
        const badgeX = px - badgeW / 2;
        const badgeY = py - 18;

        drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 3);
        ctx.fillStyle = "rgba(26, 26, 26, 0.85)";
        ctx.fill();
        ctx.strokeStyle = "rgba(201, 168, 76, 0.5)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.fillStyle = "rgba(232, 212, 139, 0.95)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(labelText, px, badgeY + badgeH / 2);
      }
      ctx.restore();

      // 오관 labels (right side)
      ctx.save();
      for (const feat of FIVE_FEATURES) {
        const fx = faceX + feat.x * faceW;
        const fy = faceY + feat.y * faceH;

        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(fx + 30, fy);
        ctx.strokeStyle = "rgba(139, 26, 26, 0.5)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        const label = `${feat.id}(${feat.desc})`;
        ctx.font = "bold 9px 'Noto Serif KR', serif";
        const tw = ctx.measureText(label).width;
        const lx = fx + 32;

        drawRoundedRect(ctx, lx - 2, fy - 8, tw + 6, 16, 3);
        ctx.fillStyle = "rgba(139, 26, 26, 0.75)";
        ctx.fill();

        ctx.fillStyle = "rgba(245, 240, 232, 0.95)";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(label, lx + 1, fy);
      }
      ctx.restore();

      // Face shape label (top)
      ctx.save();
      const shapeLabel = `얼굴형: ${reading.faceShape.split(" ")[0]}`;
      ctx.font = "bold 12px 'Noto Serif KR', serif";
      const shapeTW = ctx.measureText(shapeLabel).width;
      const shapeX = canvasSize / 2 - shapeTW / 2 - 8;
      const shapeY2 = 10;

      drawRoundedRect(ctx, shapeX, shapeY2, shapeTW + 16, 22, 4);
      ctx.fillStyle = "rgba(201, 168, 76, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "rgba(201, 168, 76, 0.6)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "rgba(232, 212, 139, 1)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(shapeLabel, canvasSize / 2, shapeY2 + 11);
      ctx.restore();

      // Score summary badges (bottom)
      ctx.save();
      const scores = [
        { label: "재물", score: reading.fortunes.wealth.score },
        { label: "애정", score: reading.fortunes.love.score },
        { label: "직업", score: reading.fortunes.career.score },
        { label: "건강", score: reading.fortunes.health.score },
        { label: "관계", score: reading.fortunes.relationships.score },
      ];

      const badgeTotalW = scores.length * 56 + (scores.length - 1) * 6;
      let startX = (canvasSize - badgeTotalW) / 2;
      const bottomY = canvasSize - 36;

      drawRoundedRect(ctx, startX - 8, bottomY - 6, badgeTotalW + 16, 30, 6);
      ctx.fillStyle = "rgba(26, 26, 26, 0.85)";
      ctx.fill();
      ctx.strokeStyle = "rgba(201, 168, 76, 0.3)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      for (const s of scores) {
        const color =
          s.score >= 80
            ? "rgba(201, 168, 76, 1)"
            : s.score >= 60
              ? "rgba(139, 118, 51, 1)"
              : s.score >= 40
                ? "rgba(200, 192, 176, 1)"
                : "rgba(184, 48, 48, 1)";

        ctx.font = "bold 10px 'Noto Serif KR', serif";
        ctx.fillStyle = "rgba(200, 192, 176, 0.8)";
        ctx.textAlign = "center";
        ctx.fillText(s.label, startX + 28, bottomY + 6);

        ctx.font = "bold 13px 'Noto Serif KR', serif";
        ctx.fillStyle = color;
        ctx.fillText(`${s.score}`, startX + 28, bottomY + 19);

        startX += 62;
      }
      ctx.restore();

      // Watermark
      ctx.save();
      ctx.font = "10px sans-serif";
      ctx.fillStyle = "rgba(201, 168, 76, 0.3)";
      ctx.textAlign = "right";
      ctx.fillText("AI 관상 분석", canvasSize - 10, canvasSize - 6);
      ctx.restore();

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
            분석 이미지 생성 중...
          </p>
        </div>
      )}
    </div>
  );
}
