"use client";

import { useState } from "react";
import type { GwansangReading } from "@/lib/gwansang/types";
import { useI18n } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";

interface FaceZoneMapProps {
  imageUrl: string;
  reading: GwansangReading;
}

interface Zone {
  id: string;
  labelKey: TranslationKey;
  hanja: string;
  /** SVG circle position (% of image) */
  cx: number;
  cy: number;
  /** Which feature key this maps to */
  featureKey?: keyof GwansangReading["features"];
  /** Which role description key */
  roleKey: TranslationKey;
  /** Which fortune it connects to */
  fortuneKey?: keyof GwansangReading["fortunes"];
}

interface GridLine {
  y: number;
  labelKey: TranslationKey;
  descKey: TranslationKey;
}

/** Grid lines for 삼정 (Three Courts) */
const GRID_LINES: GridLine[] = [
  { y: 15, labelKey: "gwansang.faceZone.grid.upper", descKey: "gwansang.faceZone.grid.upper.desc" },
  { y: 43, labelKey: "gwansang.faceZone.grid.middle", descKey: "gwansang.faceZone.grid.middle.desc" },
  { y: 70, labelKey: "gwansang.faceZone.grid.lower", descKey: "gwansang.faceZone.grid.lower.desc" },
];

/** Zone definitions mapped to face positions */
const ZONES: Zone[] = [
  {
    id: "forehead",
    labelKey: "gwansang.faceZone.forehead",
    hanja: "天庭",
    cx: 50,
    cy: 22,
    featureKey: "forehead",
    roleKey: "gwansang.faceZone.role.forehead",
    fortuneKey: "career",
  },
  {
    id: "eyebrow-l",
    labelKey: "gwansang.faceZone.eyebrows",
    hanja: "保壽",
    cx: 35,
    cy: 35,
    featureKey: "eyebrows",
    roleKey: "gwansang.faceZone.role.eyebrows",
    fortuneKey: "relationships",
  },
  {
    id: "eyes",
    labelKey: "gwansang.faceZone.eyes",
    hanja: "監察",
    cx: 50,
    cy: 42,
    featureKey: "eyes",
    roleKey: "gwansang.faceZone.role.eyes",
    fortuneKey: "love",
  },
  {
    id: "nose",
    labelKey: "gwansang.faceZone.nose",
    hanja: "審判",
    cx: 50,
    cy: 55,
    featureKey: "nose",
    roleKey: "gwansang.faceZone.role.nose",
    fortuneKey: "wealth",
  },
  {
    id: "mouth",
    labelKey: "gwansang.faceZone.mouth",
    hanja: "出納",
    cx: 50,
    cy: 68,
    featureKey: "mouth",
    roleKey: "gwansang.faceZone.role.mouth",
    fortuneKey: "relationships",
  },
  {
    id: "ears",
    labelKey: "gwansang.faceZone.ears",
    hanja: "採聽",
    cx: 82,
    cy: 42,
    featureKey: "ears",
    roleKey: "gwansang.faceZone.role.ears",
    fortuneKey: "health",
  },
  {
    id: "chin",
    labelKey: "gwansang.faceZone.chin",
    hanja: "地閣",
    cx: 50,
    cy: 82,
    featureKey: "chin",
    roleKey: "gwansang.faceZone.role.chin",
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
  const { t } = useI18n();
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
          alt={t("gwansang.faceZone.alt")}
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
            <g key={line.labelKey}>
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
                {t(line.labelKey)}
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
                  {t(zone.labelKey)}
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
              {t("gwansang.faceZone.tapHint")}
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
                {t(active.labelKey)} ({active.hanja})
              </h4>
            </div>
            <button
              onClick={() => setActiveZone(null)}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-ivory)] transition"
            >
              {t("gwansang.faceZone.close")} ✕
            </button>
          </div>

          {/* Role */}
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            <span className="text-[var(--color-gold-dim)] font-semibold">{t("gwansang.faceZone.position")}</span>{" "}
            {t(active.roleKey)}
          </p>

          {/* Feature analysis */}
          {activeFeature && (
            <div className="bg-[var(--color-bg-base)] rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[var(--color-ivory)]">
                  {t("gwansang.faceZone.detected")} {activeFeature.type}
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
              <span className="text-[var(--color-gold-dim)]">{t("gwansang.faceZone.relatedFortune")}</span>
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
                {activeFortune.score}{t("gwansang.faceZone.unit")}
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
          {t("gwansang.faceZone.legend.grid")}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-gold-dim)] opacity-60" />
          {t("gwansang.faceZone.legend.zone")}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-px bg-[var(--color-gold-dim)] opacity-30" />
          {t("gwansang.faceZone.legend.line")}
        </span>
      </div>
    </div>
  );
}
