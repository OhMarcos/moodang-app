"use client";

import { useState } from "react";
import type { GwansangReading } from "@/lib/gwansang/types";

interface FaceZoneMapProps {
  imageUrl: string;
  reading: GwansangReading;
}

interface Zone {
  id: string;
  label: string;
  hanja: string;
  /** SVG circle position (% of image) */
  cx: number;
  cy: number;
  /** Which feature key this maps to */
  featureKey?: keyof GwansangReading["features"];
  /** Which 12궁 or category this represents */
  role: string;
  /** Which fortune it connects to */
  fortuneKey?: keyof GwansangReading["fortunes"];
}

/** Grid lines for 삼정 (Three Courts) */
const GRID_LINES: { y: number; label: string; desc: string }[] = [
  { y: 15, label: "상정(上停)", desc: "초년운 · 지성 · 부모운" },
  { y: 43, label: "중정(中停)", desc: "중년운 · 의지 · 사회운" },
  { y: 70, label: "하정(下停)", desc: "말년운 · 실행 · 부하운" },
];

/** Zone definitions mapped to face positions */
const ZONES: Zone[] = [
  {
    id: "forehead",
    label: "이마",
    hanja: "天庭",
    cx: 50,
    cy: 22,
    featureKey: "forehead",
    role: "관록궁 · 복덕궁 — 초년운, 지적 능력, 사회적 지위",
    fortuneKey: "career",
  },
  {
    id: "eyebrow-l",
    label: "눈썹",
    hanja: "保壽",
    cx: 35,
    cy: 35,
    featureKey: "eyebrows",
    role: "형제궁 · 보수관 — 형제운, 감정 표현, 수명",
    fortuneKey: "relationships",
  },
  {
    id: "eyes",
    label: "눈",
    hanja: "監察",
    cx: 50,
    cy: 42,
    featureKey: "eyes",
    role: "명궁 · 감찰관 — 선천 운명, 내면, 의지력",
    fortuneKey: "love",
  },
  {
    id: "nose",
    label: "코",
    hanja: "審判",
    cx: 50,
    cy: 55,
    featureKey: "nose",
    role: "재백궁 · 심판관 — 재물운, 자존감, 40대 운세",
    fortuneKey: "wealth",
  },
  {
    id: "mouth",
    label: "입",
    hanja: "出納",
    cx: 50,
    cy: 68,
    featureKey: "mouth",
    role: "출납관 — 언어 능력, 식복, 대인관계",
    fortuneKey: "relationships",
  },
  {
    id: "ears",
    label: "귀",
    hanja: "採聽",
    cx: 82,
    cy: 42,
    featureKey: "ears",
    role: "채청관 — 수명, 지혜, 어린 시절 환경",
    fortuneKey: "health",
  },
  {
    id: "chin",
    label: "턱",
    hanja: "地閣",
    cx: 50,
    cy: 82,
    featureKey: "chin",
    role: "노복궁 · 지각 — 말년운, 부하운, 부동산운",
    fortuneKey: "wealth",
  },
];

/** Connecting lines between related zones */
const CONNECTIONS: [string, string][] = [
  ["forehead", "eyebrow-l"],
  ["eyebrow-l", "eyes"],
  ["eyes", "nose"],
  ["nose", "mouth"],
  ["mouth", "chin"],
  ["eyes", "ears"],
];

export default function FaceZoneMap({ imageUrl, reading }: FaceZoneMapProps) {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const active = activeZone
    ? ZONES.find((z) => z.id === activeZone)
    : null;

  const activeFeature = active?.featureKey
    ? reading.features?.[active.featureKey]
    : null;

  const activeFortune = active?.fortuneKey
    ? reading.fortunes?.[active.fortuneKey]
    : null;

  function getZonePos(id: string) {
    const z = ZONES.find((z) => z.id === id);
    return z ? { cx: z.cx, cy: z.cy } : { cx: 0, cy: 0 };
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* Face image with SVG overlay */}
      <div className="relative rounded-xl overflow-hidden border border-[var(--color-border)]">
        {/* Base image */}
        <img
          src={imageUrl}
          alt="분석 대상 얼굴"
          className="w-full aspect-square object-cover"
          style={{ filter: "brightness(0.85) contrast(1.1)" }}
        />

        {/* SVG overlay */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: "none" }}
        >
          {/* Subtle grid background */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 삼정 horizontal division lines */}
          {GRID_LINES.map((line) => (
            <g key={line.label}>
              <line
                x1="12"
                y1={line.y}
                x2="88"
                y2={line.y}
                stroke="rgba(201, 168, 76, 0.5)"
                strokeWidth="0.3"
                strokeDasharray="2 1"
              />
              <text
                x="9"
                y={line.y + 0.8}
                fill="rgba(201, 168, 76, 0.85)"
                fontSize="2.2"
                fontWeight="bold"
                textAnchor="end"
                dominantBaseline="middle"
              >
                {line.label}
              </text>
            </g>
          ))}

          {/* Vertical center line */}
          <line
            x1="50"
            y1="10"
            x2="50"
            y2="90"
            stroke="rgba(201, 168, 76, 0.2)"
            strokeWidth="0.2"
            strokeDasharray="1.5 1.5"
          />

          {/* Connection lines between zones */}
          {CONNECTIONS.map(([from, to]) => {
            const a = getZonePos(from);
            const b = getZonePos(to);
            return (
              <line
                key={`${from}-${to}`}
                x1={a.cx}
                y1={a.cy}
                x2={b.cx}
                y2={b.cy}
                stroke={
                  activeZone === from || activeZone === to
                    ? "rgba(201, 168, 76, 0.6)"
                    : "rgba(201, 168, 76, 0.15)"
                }
                strokeWidth="0.3"
              />
            );
          })}

          {/* Zone markers */}
          {ZONES.map((zone) => {
            const isActive = activeZone === zone.id;
            return (
              <g key={zone.id} filter={isActive ? "url(#glow)" : undefined}>
                {/* Outer pulse ring */}
                {isActive && (
                  <circle
                    cx={zone.cx}
                    cy={zone.cy}
                    r="4"
                    fill="none"
                    stroke="rgba(201, 168, 76, 0.4)"
                    strokeWidth="0.3"
                    className="animate-ping"
                    style={{ transformOrigin: `${zone.cx}% ${zone.cy}%` }}
                  />
                )}

                {/* Outer ring */}
                <circle
                  cx={zone.cx}
                  cy={zone.cy}
                  r="3"
                  fill="none"
                  stroke={isActive ? "rgba(201, 168, 76, 0.8)" : "rgba(201, 168, 76, 0.4)"}
                  strokeWidth="0.3"
                />

                {/* Center dot */}
                <circle
                  cx={zone.cx}
                  cy={zone.cy}
                  r="1.2"
                  fill={isActive ? "rgba(201, 168, 76, 0.9)" : "rgba(201, 168, 76, 0.6)"}
                />

                {/* Clickable hit area (larger, invisible) */}
                <circle
                  cx={zone.cx}
                  cy={zone.cy}
                  r="6"
                  fill="transparent"
                  style={{ pointerEvents: "all", cursor: "pointer" }}
                  onClick={() => setActiveZone(isActive ? null : zone.id)}
                />

                {/* Label */}
                <text
                  x={zone.cx}
                  y={zone.cy - 4.5}
                  fill={isActive ? "rgba(232, 212, 139, 1)" : "rgba(201, 168, 76, 0.8)"}
                  fontSize="2.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  style={{ pointerEvents: "none" }}
                >
                  {zone.label}
                </text>

                {/* Hanja subtitle */}
                <text
                  x={zone.cx}
                  y={zone.cy + 4.8}
                  fill="rgba(201, 168, 76, 0.5)"
                  fontSize="1.8"
                  textAnchor="middle"
                  style={{ pointerEvents: "none" }}
                >
                  {zone.hanja}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tap hint */}
        {!activeZone && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm">
            <p className="text-[10px] text-[var(--color-gold-dim)] whitespace-nowrap">
              구역을 탭하여 분석 근거를 확인하세요
            </p>
          </div>
        )}
      </div>

      {/* Active zone detail card */}
      {active && (
        <div className="animate-fade-in-up border-traditional rounded-xl bg-[var(--color-bg-card)] p-4 space-y-3">
          {/* Zone header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-gold)]" />
              <h4 className="font-[family-name:var(--font-serif)] text-sm font-bold text-[var(--color-gold)]">
                {active.label} ({active.hanja})
              </h4>
            </div>
            <button
              onClick={() => setActiveZone(null)}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-ivory)] transition"
            >
              닫기 ✕
            </button>
          </div>

          {/* Role */}
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            <span className="text-[var(--color-gold-dim)] font-semibold">관상학 위치:</span>{" "}
            {active.role}
          </p>

          {/* Feature analysis */}
          {activeFeature && (
            <div className="bg-[var(--color-bg-base)] rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[var(--color-ivory)]">
                  감지: {activeFeature.type}
                </p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`text-[10px] ${
                        i < activeFeature.rating
                          ? "text-[var(--color-gold)]"
                          : "text-[var(--color-bg-elevated)]"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {activeFeature.description}
              </p>
            </div>
          )}

          {/* Connected fortune */}
          {activeFortune && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--color-gold-dim)]">→ 연관 운세:</span>
              <span
                className="font-bold font-mono"
                style={{
                  color:
                    activeFortune.score >= 70
                      ? "var(--color-gold)"
                      : activeFortune.score >= 40
                        ? "var(--color-ivory-dim)"
                        : "var(--color-red)",
                }}
              >
                {activeFortune.score}점
              </span>
              <span className="text-[var(--color-text-muted)]">
                {activeFortune.summary}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-px bg-[var(--color-gold-dim)] opacity-50" style={{ borderTop: "1px dashed var(--color-gold-dim)" }} />
          삼정 구분선
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-gold-dim)] opacity-60" />
          분석 구역
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-px bg-[var(--color-gold-dim)] opacity-30" />
          연결선
        </span>
      </div>
    </div>
  );
}
