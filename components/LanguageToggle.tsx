"use client";

import { useI18n } from "@/lib/i18n/context";

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
      className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-mystic-purple)]/50 transition backdrop-blur-sm"
      aria-label="Toggle language"
    >
      {locale === "ko" ? "EN" : "한국어"}
    </button>
  );
}
