"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

interface ReadingPreview {
  fortune_grade?: string | null;
  destiny_type_hanja?: string | null;
  celebrity_match?: string | null;
}

interface SharePageContentProps {
  type: string;
  nickname?: string;
  reading?: ReadingPreview | null;
}

export default function SharePageContent({ type, nickname, reading }: SharePageContentProps) {
  const { t } = useI18n();
  const isGwansang = type === "gwansang";

  const accentClass = isGwansang
    ? "bg-[var(--color-sacred-gold)]"
    : "bg-[var(--color-mystic-purple)]";
  const badgeClass = isGwansang
    ? "bg-[var(--color-sacred-gold)]/10 border border-[var(--color-sacred-gold)]/20 text-[var(--color-sacred-gold)]"
    : "bg-[var(--color-mystic-purple)]/10 border border-[var(--color-mystic-purple)]/20 text-[var(--color-mystic-purple-light)]";
  const gradientClass = isGwansang ? "text-gold-gradient" : "text-purple-gradient";

  const featuresRaw = isGwansang
    ? t("sharePage.gwansang.features")
    : t("sharePage.saju.features");
  const features = featuresRaw.split("|");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${badgeClass}`}>
          {isGwansang ? t("sharePage.gwansang.badge") : t("sharePage.saju.badge")}
        </div>

        {/* Nickname */}
        {nickname && (
          <p className={`text-2xl font-bold font-[family-name:var(--font-serif)] ${gradientClass}`}>
            &ldquo;{nickname}&rdquo;
          </p>
        )}

        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
          {isGwansang ? t("sharePage.gwansang.shared") : t("sharePage.saju.shared")}
        </h1>

        {/* DB-backed reading preview (teaser) */}
        {reading && !isGwansang && (
          <div className="rounded-2xl border border-[var(--color-border)] p-4 space-y-3 text-left">
            {reading.fortune_grade && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-[var(--color-mystic-purple-light)]">
                  {reading.fortune_grade}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">{t("sharePage.grade")}</span>
                {reading.destiny_type_hanja && (
                  <span className="ml-auto text-3xl font-serif text-[var(--color-sacred-gold)]">
                    {reading.destiny_type_hanja}
                  </span>
                )}
              </div>
            )}
            {reading.celebrity_match && (
              <p className="text-xs text-[var(--color-text-secondary)]">
                {t("sharePage.celebrityMatch")} <span className="font-semibold">{reading.celebrity_match}</span>
              </p>
            )}
            <p className="text-xs text-[var(--color-text-muted)] italic">
              {t("sharePage.fullResult")}
            </p>
          </div>
        )}

        <p className="text-sm text-[var(--color-text-secondary)]">
          {isGwansang ? t("sharePage.gwansang.cta") : t("sharePage.saju.cta")}
        </p>

        {/* Feature highlights */}
        <div className="text-left space-y-2 py-2">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${accentClass}`} />
              {f}
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/${type}`}
          className={`inline-block w-full py-4 rounded-xl font-bold text-base text-white transition hover:brightness-110 ${accentClass}`}
        >
          {t("sharePage.tryIt")}
        </Link>

        {/* Social proof */}
        <p className="text-xs text-[var(--color-text-muted)]">
          {t("sharePage.socialProof")}
        </p>

        <Link
          href="/"
          className="block text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition"
        >
          {t("sharePage.home")}
        </Link>
      </div>
    </div>
  );
}
