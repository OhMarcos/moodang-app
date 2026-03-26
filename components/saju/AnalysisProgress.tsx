"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";

const STEP_KEYS: TranslationKey[] = [
  "saju.progress.step0",
  "saju.progress.step1",
  "saju.progress.step2",
  "saju.progress.step3",
  "saju.progress.step4",
  "saju.progress.step5",
  "saju.progress.step6",
  "saju.progress.step7",
  "saju.progress.step8",
  "saju.progress.step9",
];

export default function SajuAnalysisProgress({ name }: { name: string }) {
  const { t } = useI18n();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) =>
        prev < STEP_KEYS.length - 1 ? prev + 1 : prev
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8 py-12">
      {/* Spinning yin-yang animation */}
      <div className="relative w-28 h-28">
        <div className="absolute inset-0 rounded-full border-2 border-[var(--color-mystic-purple)] opacity-20 animate-ping" />
        <div className="absolute inset-2 rounded-full border border-[var(--color-mystic-purple)] opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className="animate-spin"
            style={{ animationDuration: "8s" }}
          >
            <circle cx="24" cy="24" r="22" fill="none" stroke="var(--color-mystic-purple)" strokeWidth="1" opacity="0.6" />
            <circle cx="24" cy="24" r="16" fill="none" stroke="var(--color-mystic-purple)" strokeWidth="0.5" opacity="0.4" />
            <path
              d="M24 2 A22 22 0 0 1 24 46 A11 11 0 0 0 24 24 A11 11 0 0 1 24 2"
              fill="var(--color-mystic-purple)"
              opacity="0.15"
            />
            <circle cx="24" cy="13" r="3" fill="var(--color-mystic-purple)" opacity="0.4" />
            <circle cx="24" cy="35" r="3" fill="none" stroke="var(--color-mystic-purple)" strokeWidth="1" opacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Step text */}
      <div className="text-center space-y-3">
        <h3 className="font-[family-name:var(--font-serif)] text-lg text-[var(--color-mystic-purple)]">
          {name}{t("saju.progress.title")}
        </h3>
        <p
          key={stepIndex}
          className="text-sm text-[var(--color-text-secondary)] animate-fade-in-up min-h-[2.5rem]"
        >
          {t(STEP_KEYS[stepIndex])}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-0.5 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-mystic-purple)] transition-all duration-[2500ms] ease-linear"
            style={{
              width: `${((stepIndex + 1) / STEP_KEYS.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
