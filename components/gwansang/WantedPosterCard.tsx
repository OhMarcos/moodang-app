"use client";

import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import type { GwansangReading } from "@/lib/gwansang/types";
import type { Locale } from "@/lib/i18n/translations";

interface WantedPosterCardProps {
  imageUrl: string;
  reading: GwansangReading;
  locale: Locale;
}

export interface WantedCardHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

const SIZE = 1080;
const PAD = 50;

/** Aged parchment palette */
const P = {
  parchment: "#f5e6c8",
  parchmentDark: "#d4c4a0",
  ink: "#2a1a0a",
  inkLight: "#4a3520",
  inkFaded: "#6b5a42",
  red: "#8b1a1a",
  redLight: "#a52a2a",
  redStamp: "#c41e1e",
  gold: "#8b7633",
  goldDark: "#5a4422",
  border: "#3a2a18",
};

const TEXTS = {
  ko: {
    title: "수 배 령",
    titleSub: "搜  捕  令",
    subject: "관상 분석 대상",
    wanted: "수배",
    defaultCrime: "사람을 홀리는 관상",
    crime: "죄   목",
    bounty: "현 상 금",
    bountyUnit: "냥",
    bountyNote: "(생포 시 두 배)",
    stats: ["색기", "총기", "재력", "인복", "관종"],
    stampTop: "官",
    stampBot: "印",
    generating: "수배령 생성 중...",
  },
  en: {
    title: "W A N T E D",
    titleSub: "DEAD OR ALIVE",
    subject: "Physiognomy Subject",
    wanted: "Wanted",
    defaultCrime: "Bewitching physiognomy",
    crime: "C R I M E",
    bounty: "B O U N T Y",
    bountyUnit: "coins",
    bountyNote: "(double if alive)",
    stats: ["Charm", "Wit", "$$", "Luck", "Star"],
    stampTop: "官",
    stampBot: "印",
    generating: "Generating wanted poster...",
  },
};

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

/** Aged parchment background with stains and wear */
function drawParchmentBg(ctx: CanvasRenderingContext2D) {
  const s = SIZE;

  ctx.fillStyle = P.parchment;
  ctx.fillRect(0, 0, s, s);

  for (let i = 0; i < 8; i++) {
    const cx = Math.random() * s;
    const cy = Math.random() * s;
    const r = 100 + Math.random() * 250;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, `rgba(180, 160, 120, ${0.08 + Math.random() * 0.12})`);
    grad.addColorStop(1, "rgba(180, 160, 120, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, s, s);
  }

  const imgData = ctx.getImageData(0, 0, s, s);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const noise = (Math.random() - 0.5) * 18;
    d[i]     = Math.min(255, Math.max(0, d[i] + noise));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const edgeGrad = ctx.createLinearGradient(0, 0, 0, s);
  edgeGrad.addColorStop(0, "rgba(80, 60, 30, 0.15)");
  edgeGrad.addColorStop(0.05, "rgba(80, 60, 30, 0)");
  edgeGrad.addColorStop(0.95, "rgba(80, 60, 30, 0)");
  edgeGrad.addColorStop(1, "rgba(80, 60, 30, 0.2)");
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 0, s, s);

  const edgeGradH = ctx.createLinearGradient(0, 0, s, 0);
  edgeGradH.addColorStop(0, "rgba(80, 60, 30, 0.12)");
  edgeGradH.addColorStop(0.04, "rgba(80, 60, 30, 0)");
  edgeGradH.addColorStop(0.96, "rgba(80, 60, 30, 0)");
  edgeGradH.addColorStop(1, "rgba(80, 60, 30, 0.12)");
  ctx.fillStyle = edgeGradH;
  ctx.fillRect(0, 0, s, s);

  const stainX = s * 0.7 + Math.random() * s * 0.15;
  const stainY = s * 0.6 + Math.random() * s * 0.2;
  const stainR = 40 + Math.random() * 30;
  ctx.beginPath();
  ctx.arc(stainX, stainY, stainR, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(140, 110, 70, 0.06)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(stainX, stainY, stainR * 0.92, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(140, 110, 70, 0.08)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function applyMugshotFilter(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const imageData = ctx.getImageData(x, y, w, h);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    let lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    lum = Math.round(lum / 28) * 28;
    lum = Math.min(255, Math.max(0, (lum - 128) * 1.6 + 128));
    d[i]     = Math.min(255, lum * 0.95 + 20);
    d[i + 1] = Math.min(255, lum * 0.82 + 10);
    d[i + 2] = Math.min(255, lum * 0.65);
    const noise = (Math.random() - 0.5) * 12;
    d[i]     = Math.min(255, Math.max(0, d[i] + noise));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise));
  }
  ctx.putImageData(imageData, x, y);
}

function drawDivider(ctx: CanvasRenderingContext2D, y: number, leftX: number, rightX: number) {
  const cx = (leftX + rightX) / 2;
  ctx.strokeStyle = P.inkFaded;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(leftX, y); ctx.lineTo(cx - 30, y); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 8, y); ctx.lineTo(cx, y - 6); ctx.lineTo(cx + 8, y); ctx.lineTo(cx, y + 6);
  ctx.closePath(); ctx.fillStyle = P.inkFaded; ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + 30, y); ctx.lineTo(rightX, y); ctx.stroke();
}

function drawWantedPoster(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  reading: GwansangReading,
  locale: Locale,
) {
  const s = SIZE;
  const txt = TEXTS[locale];

  drawParchmentBg(ctx);

  // Outer border
  const borderInset = 28;
  roundRect(ctx, borderInset, borderInset, s - borderInset * 2, s - borderInset * 2, 4);
  ctx.strokeStyle = P.border;
  ctx.lineWidth = 4;
  ctx.stroke();

  roundRect(ctx, borderInset + 10, borderInset + 10, s - (borderInset + 10) * 2, s - (borderInset + 10) * 2, 2);
  ctx.strokeStyle = `${P.border}80`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Header
  let curY = PAD + 36;
  ctx.font = `bold 72px "Noto Serif KR", serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = P.ink;
  ctx.fillText(txt.title, s / 2, curY);

  curY += 34;
  ctx.font = `400 26px "Noto Serif KR", serif`;
  ctx.fillStyle = P.inkFaded;
  ctx.fillText(txt.titleSub, s / 2, curY);

  curY += 20;
  drawDivider(ctx, curY, PAD + 40, s - PAD - 40);

  // Headline
  curY += 40;
  const nickname = reading.funTags?.nickname ?? txt.subject;
  const shortNick = nickname.replace(/의 상이(로구나|구나|이로다).*$/, "").trim();
  const headline = shortNick || nickname;

  ctx.font = `bold 32px "Noto Serif KR", serif`;
  ctx.fillStyle = P.red;
  ctx.textAlign = "center";
  ctx.fillText(`${txt.wanted}: ${headline}`, s / 2, curY);

  // Photo
  curY += 24;
  const photoW = s * 0.5;
  const photoH = s * 0.38;
  const photoX = (s - photoW) / 2;
  const photoY = curY;

  ctx.fillStyle = P.border;
  ctx.fillRect(photoX - 4, photoY - 4, photoW + 8, photoH + 8);

  ctx.save();
  ctx.beginPath();
  ctx.rect(photoX, photoY, photoW, photoH);
  ctx.clip();

  const imgRatio = img.width / img.height;
  const targetRatio = photoW / photoH;
  let sx: number, sy: number, sw: number, sh: number;
  if (imgRatio > targetRatio) {
    sh = img.height; sw = sh * targetRatio; sx = (img.width - sw) / 2; sy = 0;
  } else {
    sw = img.width; sh = sw / targetRatio; sx = 0; sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
  applyMugshotFilter(ctx, photoX, photoY, photoW, photoH);
  ctx.restore();

  // Photo corner marks
  ctx.strokeStyle = P.inkLight;
  ctx.lineWidth = 2;
  const cm = 16;
  ctx.beginPath(); ctx.moveTo(photoX, photoY + cm); ctx.lineTo(photoX, photoY); ctx.lineTo(photoX + cm, photoY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(photoX + photoW - cm, photoY); ctx.lineTo(photoX + photoW, photoY); ctx.lineTo(photoX + photoW, photoY + cm); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(photoX, photoY + photoH - cm); ctx.lineTo(photoX, photoY + photoH); ctx.lineTo(photoX + cm, photoY + photoH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(photoX + photoW - cm, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH); ctx.lineTo(photoX + photoW, photoY + photoH - cm); ctx.stroke();

  // Crime & Bounty
  curY = photoY + photoH + 36;
  const crime = reading.harshTruths?.truths?.[0] ?? txt.defaultCrime;
  const crimeShort = crime.length > 25 ? crime.slice(0, 25) + "..." : crime;

  ctx.font = `bold 28px "Noto Serif KR", serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = P.ink;
  ctx.fillText(txt.crime, s / 2, curY);

  curY += 34;
  ctx.font = `400 24px "Noto Serif KR", serif`;
  ctx.fillStyle = P.inkLight;
  ctx.fillText(crimeShort, s / 2, curY);

  curY += 24;
  drawDivider(ctx, curY, PAD + 80, s - PAD - 80);

  curY += 36;
  const bounty = reading.funTags?.charmScore ?? reading.viralScores.sexAppeal;

  ctx.font = `bold 28px "Noto Serif KR", serif`;
  ctx.fillStyle = P.ink;
  ctx.fillText(txt.bounty, s / 2, curY);

  curY += 42;
  ctx.font = `bold 52px "Noto Serif KR", serif`;
  ctx.fillStyle = P.red;
  ctx.fillText(`${bounty} ${txt.bountyUnit}`, s / 2, curY);

  curY += 22;
  ctx.font = `400 16px "Noto Serif KR", serif`;
  ctx.fillStyle = P.inkFaded;
  ctx.fillText(txt.bountyNote, s / 2, curY);

  // Stats
  curY += 32;
  drawDivider(ctx, curY, PAD + 40, s - PAD - 40);
  curY += 28;

  const scores = reading.viralScores;
  const statValues = [scores.sexAppeal, scores.sharpMind, scores.wealthPotential, scores.peopleLuck, scores.mainCharacterEnergy];

  const totalStatsW = txt.stats.length * 100 + (txt.stats.length - 1) * 20;
  let statX = (s - totalStatsW) / 2;

  for (let i = 0; i < txt.stats.length; i++) {
    const value = statValues[i];
    ctx.font = `bold 18px "Noto Serif KR", serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = P.inkFaded;
    ctx.fillText(txt.stats[i], statX + 50, curY);

    ctx.font = `bold 28px "Noto Serif KR", serif`;
    ctx.fillStyle = value >= 70 ? P.red : value >= 40 ? P.ink : P.inkFaded;
    ctx.fillText(`${value}`, statX + 50, curY + 32);

    statX += 120;
  }

  // Red stamp
  const stampX = s * 0.78;
  const stampY = photoY + photoH - 20;
  const stampR = 48;

  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.beginPath(); ctx.arc(stampX, stampY, stampR, 0, Math.PI * 2);
  ctx.strokeStyle = P.redStamp; ctx.lineWidth = 4; ctx.stroke();
  ctx.beginPath(); ctx.arc(stampX, stampY, stampR - 8, 0, Math.PI * 2);
  ctx.strokeStyle = P.redStamp; ctx.lineWidth = 1.5; ctx.stroke();

  ctx.font = `bold 32px "Noto Serif KR", serif`;
  ctx.fillStyle = P.redStamp;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(txt.stampTop, stampX, stampY - 14);
  ctx.fillText(txt.stampBot, stampX, stampY + 18);

  ctx.globalAlpha = 0.15;
  ctx.beginPath(); ctx.arc(stampX + 3, stampY + 2, stampR - 4, 0, Math.PI * 2);
  ctx.fillStyle = P.redStamp; ctx.fill();
  ctx.restore();

  // Watermark
  ctx.font = `bold 16px sans-serif`;
  ctx.textAlign = "right";
  ctx.fillStyle = `${P.inkFaded}80`;
  ctx.fillText("moodang.app", s - PAD - 6, s - PAD + 6);

  // Torn edge effect
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  for (let x = 0; x < s; x += 3) {
    const topH = Math.random() * 4 + 1;
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(x, 0, 3, topH);
    const botH = Math.random() * 4 + 1;
    ctx.fillRect(x, s - botH, 3, botH);
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

const WantedPosterCard = forwardRef<WantedCardHandle, WantedPosterCardProps>(
  function WantedPosterCard({ imageUrl, reading, locale }, ref) {
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
        canvas.width = SIZE;
        canvas.height = SIZE;
        drawWantedPoster(ctx, img, reading, locale);
        setIsReady(true);
      };

      img.src = imageUrl;
    }, [imageUrl, reading, locale]);

    return (
      <div className="relative w-full max-w-md mx-auto">
        <canvas
          ref={canvasRef}
          className={`w-full rounded-xl border border-[var(--color-border)] transition-opacity duration-500 ${isReady ? "opacity-100" : "opacity-0"}`}
        />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-card)] rounded-xl">
            <p className="text-sm text-[var(--color-text-secondary)] animate-pulse-gold">
              {TEXTS[locale].generating}
            </p>
          </div>
        )}
      </div>
    );
  },
);

export default WantedPosterCard;
