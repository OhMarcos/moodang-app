"use client";

import type { FortuneReading } from "@/lib/gwansang/types";
import { getScoreColor } from "@/lib/gwansang/utils";
import { useI18n } from "@/lib/i18n/context";

interface ReadingCardProps {
  title: string;
  icon: string;
  fortune: FortuneReading;
  delay?: number;
}

export default function ReadingCard({
  title,
  icon,
  fortune,
  delay = 0,
}: ReadingCardProps) {
  const { t } = useI18n();

  return (
    <div
      className="border-traditional rounded-xl bg-[var(--color-bg-card)] p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-[family-name:var(--font-serif)] text-base font-bold text-[var(--color-ivory)]">
            {title}
          </h3>
        </div>
        <span
          className="text-2xl font-bold font-[family-name:var(--font-serif)]"
          style={{ color: getScoreColor(fortune.score) }}
        >
          {fortune.score}
        </span>
      </div>

      {/* Score bar */}
      <div className="mb-4">
        <div className="h-1.5 bg-[var(--color-bg)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full animate-fill"
            style={{
              "--fill-width": `${fortune.score}%`,
              backgroundColor: getScoreColor(fortune.score),
            } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm font-semibold text-[var(--color-gold-light)] mb-2">
        {fortune.summary}
      </p>

      {/* Detail */}
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
        {fortune.detail}
      </p>

      {/* Advice */}
      <div className="bg-[var(--color-bg)] rounded-lg p-3 border border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-gold-dim)] font-semibold mb-1">
          {t("common.advice")}
        </p>
        <p className="text-sm text-[var(--color-ivory-dim)] leading-relaxed">
          {fortune.advice}
        </p>
      </div>
    </div>
  );
}
