"use client";

import { useI18n } from "@/lib/i18n/context";

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
      className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-[var(--color-border)] bg-[var(--color-bg-card)]/80 text-[var(--color-text-secondary)] hover:border-[var(--color-sacred-gold)]/60 hover:text-[var(--color-sacred-gold)] transition-all backdrop-blur-md shadow-sm"
      aria-label="Toggle language"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495A18.023 18.023 0 0 1 3.75 7.488"
        />
      </svg>
      {locale === "ko" ? "EN" : "KO"}
    </button>
  );
}
