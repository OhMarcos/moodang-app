"use client";

import { useRef } from "react";
import type { GwansangReading } from "@/lib/gwansang/types";
import ReadingCard from "./ReadingCard";
import FeatureCard from "./FeatureCard";
import FaceAnalysisOverlay, { type CardHandle } from "./FaceAnalysisOverlay";
import FaceDiagram from "./FaceDiagram";
import FaceZoneMap from "./FaceZoneMap";
import ShareButtons from "@/components/ShareButtons";
import { getScoreColor } from "@/lib/gwansang/utils";
import { useI18n } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";

interface ReadingResultProps {
  reading: GwansangReading;
  imageUrl: string;
  onReset: () => void;
  readingId?: string | null;
}

const VIRAL_SCORE_CONFIG = [
  { key: "sexAppeal" as const, labelKey: "gwansang.result.stats.sexAppeal" as TranslationKey, emoji: "🔥", descKey: "gwansang.result.stats.sexAppeal.desc" as TranslationKey },
  { key: "sharpMind" as const, labelKey: "gwansang.result.stats.sharpMind" as TranslationKey, emoji: "🧠", descKey: "gwansang.result.stats.sharpMind.desc" as TranslationKey },
  { key: "wealthPotential" as const, labelKey: "gwansang.result.stats.wealthPotential" as TranslationKey, emoji: "💰", descKey: "gwansang.result.stats.wealthPotential.desc" as TranslationKey },
  { key: "peopleLuck" as const, labelKey: "gwansang.result.stats.peopleLuck" as TranslationKey, emoji: "🤝", descKey: "gwansang.result.stats.peopleLuck.desc" as TranslationKey },
  { key: "mainCharacterEnergy" as const, labelKey: "gwansang.result.stats.mainCharacterEnergy" as TranslationKey, emoji: "⭐", descKey: "gwansang.result.stats.mainCharacterEnergy.desc" as TranslationKey },
];

const FORTUNE_CONFIG = [
  { key: "wealth" as const, titleKey: "gwansang.result.fortune.wealth" as TranslationKey, icon: "💰" },
  { key: "love" as const, titleKey: "gwansang.result.fortune.love" as TranslationKey, icon: "💕" },
  { key: "career" as const, titleKey: "gwansang.result.fortune.career" as TranslationKey, icon: "💼" },
  { key: "health" as const, titleKey: "gwansang.result.fortune.health" as TranslationKey, icon: "🏥" },
  { key: "relationships" as const, titleKey: "gwansang.result.fortune.relationships" as TranslationKey, icon: "🤝" },
];

const FEATURE_CONFIG = [
  { key: "forehead" as const, labelKey: "gwansang.result.features.forehead" as TranslationKey, icon: "🔮" },
  { key: "eyebrows" as const, labelKey: "gwansang.result.features.eyebrows" as TranslationKey, icon: "🌙" },
  { key: "eyes" as const, labelKey: "gwansang.result.features.eyes" as TranslationKey, icon: "👁" },
  { key: "nose" as const, labelKey: "gwansang.result.features.nose" as TranslationKey, icon: "👃" },
  { key: "mouth" as const, labelKey: "gwansang.result.features.mouth" as TranslationKey, icon: "👄" },
  { key: "ears" as const, labelKey: "gwansang.result.features.ears" as TranslationKey, icon: "👂" },
  { key: "chin" as const, labelKey: "gwansang.result.features.chin" as TranslationKey, icon: "🗿" },
];

export default function ReadingResult({
  reading,
  imageUrl,
  onReset,
  readingId,
}: ReadingResultProps) {
  const { t } = useI18n();
  const cardRef = useRef<CardHandle>(null);

  const canvasRef = {
    get current() {
      return cardRef.current?.getCanvas() ?? null;
    },
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 pb-12">
      {/* 1. Card Image (hero — screenshot-worthy) */}
      <div className="animate-fade-in-up">
        <h2 className="font-[family-name:var(--font-serif)] text-xl font-bold text-[var(--color-gold)] mb-4 text-center">
          {t("gwansang.result.title")}
        </h2>
        <FaceAnalysisOverlay ref={cardRef} imageUrl={imageUrl} reading={reading} />
      </div>

      {/* 2. Share Buttons (for Pokemon card) */}
      <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <ShareButtons
          canvasRef={canvasRef as React.RefObject<HTMLCanvasElement | null>}
          type="gwansang"
          nickname={reading.funTags?.nickname}
          accent="var(--color-sacred-gold)"
          readingId={readingId}
        />
      </div>

      {/* 2.5. Interactive Face Zone Map */}
      <div className="animate-fade-in-up" style={{ animationDelay: "120ms" }}>
        <h3 className="font-[family-name:var(--font-serif)] text-base font-bold text-[var(--color-ivory)] mb-3 text-center flex items-center justify-center gap-2">
          <span>🔍</span> {t("gwansang.result.faceZone.title")}
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-3 text-center">
          {t("gwansang.result.faceZone.desc")}
        </p>
        <FaceZoneMap imageUrl={imageUrl} reading={reading} />
      </div>

      {/* 3. Viral Scores Expanded */}
      {reading.viralScores && (
        <div
          className="border-traditional rounded-xl bg-[var(--color-bg-card)] p-5 animate-fade-in-up"
          style={{ animationDelay: "150ms" }}
        >
          <h3 className="font-[family-name:var(--font-serif)] text-base font-bold text-[var(--color-gold)] mb-4 text-center">
            {t("gwansang.result.stats.title")}
          </h3>
          <div className="space-y-4">
            {VIRAL_SCORE_CONFIG.map((cfg) => {
              const value = reading.viralScores?.[cfg.key] ?? 0;
              return (
                <div key={cfg.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-[var(--color-ivory)] flex items-center gap-1.5">
                      <span>{cfg.emoji}</span> {t(cfg.labelKey)}
                    </span>
                    <span
                      className="text-sm font-bold font-mono"
                      style={{ color: getScoreColor(value) }}
                    >
                      {value}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[var(--color-bg)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${value}%`,
                        background:
                          value >= 70
                            ? `linear-gradient(90deg, var(--color-gold-dim), var(--color-gold))`
                            : value >= 40
                              ? `linear-gradient(90deg, var(--color-bg-elevated), var(--color-ivory-dim))`
                              : `linear-gradient(90deg, #7f1d1d, var(--color-red))`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t(cfg.descKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Harsh Truths (engagement hook) */}
      {reading.harshTruths && (
        <div
          className="animate-fade-in-up space-y-3"
          style={{ animationDelay: "200ms" }}
        >
          <div className="rounded-xl border border-[var(--color-red-dark,#7f1d1d)] bg-gradient-to-b from-[rgba(139,26,26,0.12)] to-[var(--color-bg-card)] p-5">
            <h3 className="font-[family-name:var(--font-serif)] text-base font-bold text-[var(--color-red-light)] mb-4 flex items-center gap-2">
              <span>⚠️</span> {t("gwansang.result.harshTruths")}
            </h3>
            <div className="space-y-3">
              {reading.harshTruths.truths.map((truth, i) => (
                <div key={i} className="flex gap-2.5">
                  <span className="text-[var(--color-red-light)] text-xs font-bold mt-0.5 shrink-0">
                    {i + 1}.
                  </span>
                  <p className="text-sm text-[var(--color-ivory)] leading-relaxed">{truth}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[var(--color-red)] bg-[rgba(139,26,26,0.2)] p-4 text-center">
            <p className="text-xs text-[var(--color-red-light)] mb-1 tracking-widest font-semibold">{t("gwansang.result.warning")}</p>
            <p className="text-sm text-[var(--color-ivory)] leading-relaxed font-medium">
              {reading.harshTruths.warning}
            </p>
          </div>
        </div>
      )}

      {/* 5. Fun Tags */}
      {reading.funTags && (
        <div className="animate-fade-in-up space-y-3" style={{ animationDelay: "250ms" }}>
          {/* Nickname Banner */}
          <div className="border-traditional rounded-xl bg-gradient-to-r from-[var(--color-red-dark,#7f1d1d)] to-[var(--color-bg-card)] p-5 text-center">
            <p className="text-xs text-[var(--color-gold-dim)] mb-1 tracking-widest">{t("gwansang.result.nickname.label")}</p>
            <p className="font-[family-name:var(--font-serif)] text-lg font-bold text-[var(--color-gold)]">
              &ldquo;{reading.funTags.nickname}&rdquo;
            </p>
          </div>

          {/* Charm Score */}
          <div className="border-traditional rounded-xl bg-[var(--color-bg-card)] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-[family-name:var(--font-serif)] text-base font-bold text-[var(--color-gold)] flex items-center gap-2">
                <span>🔥</span> {t("gwansang.result.charm.title")}
              </h3>
              <span
                className="text-xl font-bold"
                style={{ color: getScoreColor(reading.funTags.charmScore) }}
              >
                {reading.funTags.charmScore}{t("gwansang.result.charm.unit")}
              </span>
            </div>
            <p className="text-sm text-[var(--color-ivory)] leading-relaxed">
              {reading.funTags.charmDescription}
            </p>
          </div>

          {/* 2-column grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border-traditional rounded-xl bg-[var(--color-bg-card)] p-4">
              <p className="text-xs text-[var(--color-gold-dim)] mb-1.5 flex items-center gap-1">
                <span>💎</span> {t("gwansang.result.hiddenCharm")}
              </p>
              <p className="text-sm text-[var(--color-ivory)] leading-relaxed">
                {reading.funTags.hiddenCharm}
              </p>
            </div>
            <div className="border-traditional rounded-xl bg-[var(--color-bg-card)] p-4">
              <p className="text-xs text-[var(--color-gold-dim)] mb-1.5 flex items-center gap-1">
                <span>⚡</span> {t("gwansang.result.hiddenTalent")}
              </p>
              <p className="text-sm text-[var(--color-ivory)] leading-relaxed">
                {reading.funTags.hiddenTalent}
              </p>
            </div>
          </div>

          {/* Romantic Fortune */}
          <div className="border-traditional rounded-xl bg-[var(--color-bg-card)] p-5">
            <h3 className="font-[family-name:var(--font-serif)] text-base font-bold text-[var(--color-gold)] mb-2 flex items-center gap-2">
              <span>💘</span> {t("gwansang.result.romanticFortune")}
            </h3>
            <p className="text-sm text-[var(--color-ivory)] leading-relaxed">
              {reading.funTags.romanticFortune}
            </p>
          </div>

          {/* Past Life */}
          <div className="border-traditional rounded-xl bg-gradient-to-r from-[var(--color-bg-card)] to-[rgba(201,168,76,0.08)] p-5 text-center">
            <p className="text-xs text-[var(--color-gold-dim)] mb-1 tracking-widest">{t("gwansang.result.pastLife")}</p>
            <p className="font-[family-name:var(--font-serif)] text-base font-bold text-[var(--color-ivory)] mt-1">
              {reading.funTags.pastLifeJob}
            </p>
          </div>
        </div>
      )}

      {/* 6. Fortune Readings */}
      <div>
        <h3
          className="font-[family-name:var(--font-serif)] text-base font-bold text-[var(--color-ivory)] mb-3 flex items-center gap-2 animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <span>🎯</span> {t("gwansang.result.fortune.title")}
        </h3>
        <div className="space-y-3">
          {FORTUNE_CONFIG.map((cfg, i) => {
            const fortune = reading.fortunes?.[cfg.key];
            if (!fortune) return null;
            return (
              <ReadingCard
                key={cfg.key}
                title={t(cfg.titleKey)}
                icon={cfg.icon}
                fortune={fortune}
                delay={400 + i * 100}
              />
            );
          })}
        </div>
      </div>

      {/* 7. Feature Analysis */}
      <div className="animate-fade-in-up" style={{ animationDelay: "900ms" }}>
        <h3 className="font-[family-name:var(--font-serif)] text-base font-bold text-[var(--color-ivory)] mb-3 flex items-center gap-2">
          <span>🏛</span> {t("gwansang.result.features.title")}
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {FEATURE_CONFIG.map((cfg) => {
            const feature = reading.features?.[cfg.key];
            if (!feature) return null;
            return (
              <FeatureCard
                key={cfg.key}
                label={t(cfg.labelKey)}
                icon={cfg.icon}
                feature={feature}
              />
            );
          })}
        </div>
      </div>

      {/* 7.5. Face Diagram (12궁/삼정/오관) */}
      <div className="animate-fade-in-up" style={{ animationDelay: "950ms" }}>
        <h3 className="font-[family-name:var(--font-serif)] text-base font-bold text-[var(--color-ivory)] mb-3 flex items-center gap-2">
          <span>🗺</span> {t("gwansang.result.faceDiagram.title")}
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-3 text-center">
          {t("gwansang.result.faceDiagram.desc")}
        </p>
        <FaceDiagram imageUrl={imageUrl} reading={reading} />
      </div>

      {/* 8. Lucky Elements */}
      <div
        className="border-traditional rounded-xl bg-[var(--color-bg-card)] p-5 animate-fade-in-up"
        style={{ animationDelay: "1000ms" }}
      >
        <h3 className="font-[family-name:var(--font-serif)] text-base font-bold text-[var(--color-gold)] mb-3 flex items-center gap-2">
          <span>🍀</span> {t("gwansang.result.luckyElements.title")}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xs text-[var(--color-text-secondary)] mb-1">{t("gwansang.result.luckyElements.color")}</p>
            <p className="text-sm font-semibold text-[var(--color-ivory)]">{reading.luckyElements?.color ?? "-"}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[var(--color-text-secondary)] mb-1">{t("gwansang.result.luckyElements.number")}</p>
            <p className="text-sm font-semibold text-[var(--color-ivory)]">{reading.luckyElements?.number ?? "-"}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[var(--color-text-secondary)] mb-1">{t("gwansang.result.luckyElements.direction")}</p>
            <p className="text-sm font-semibold text-[var(--color-ivory)]">{reading.luckyElements?.direction ?? "-"}</p>
          </div>
        </div>
      </div>

      {/* Overall Impression + Life Advice */}
      <div
        className="border-traditional rounded-xl bg-[var(--color-bg-card)] p-5 animate-fade-in-up"
        style={{ animationDelay: "1100ms" }}
      >
        <h3 className="font-[family-name:var(--font-serif)] text-base font-bold text-[var(--color-gold)] mb-3 flex items-center gap-2">
          <span>📜</span> {t("gwansang.result.overall.title")}
        </h3>
        <p className="text-sm text-[var(--color-ivory)] leading-relaxed mb-3">
          {reading.overallImpression}
        </p>
        <hr className="border-[var(--color-border)] my-3" />
        <p className="text-sm text-[var(--color-ivory)] leading-relaxed">
          {reading.lifeAdvice}
        </p>
      </div>

      {/* Actions */}
      <div className="animate-fade-in-up" style={{ animationDelay: "1200ms" }}>
        <button
          onClick={onReset}
          className="w-full py-3.5 px-4 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] font-semibold text-sm hover:border-[var(--color-gold-dim)] transition"
        >
          {t("gwansang.result.resetButton")}
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-[var(--color-text-secondary)] opacity-60 pt-4 whitespace-pre-line">
        {t("gwansang.result.disclaimer")}
      </p>
    </div>
  );
}
