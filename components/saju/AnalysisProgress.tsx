"use client";

import { useEffect, useState } from "react";

const ANALYSIS_STEPS = [
  "사주팔자 정보를 확인하고 있습니다...",
  "년주(年柱)와 월주(月柱)를 분석하고 있습니다...",
  "일주(日柱) 일간의 힘을 측정하고 있습니다...",
  "시주(時柱)의 흐름을 파악하고 있습니다...",
  "십신(十神)과 용신(用神)을 해석하고 있습니다...",
  "오행(五行) 균형을 확인하고 있습니다...",
  "대운(大運) 흐름을 계산하고 있습니다...",
  "베딕 나크샤트라와 다샤를 분석하고 있습니다...",
  "주역 괘상을 해석하고 있습니다...",
  "삼중 렌즈 교차분석을 마무리하고 있습니다...",
];

export default function SajuAnalysisProgress({ name }: { name: string }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) =>
        prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev
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
          {name}님의 운명을 분석하고 있습니다
        </h3>
        <p
          key={stepIndex}
          className="text-sm text-[var(--color-text-secondary)] animate-fade-in-up min-h-[2.5rem]"
        >
          {ANALYSIS_STEPS[stepIndex]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-0.5 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-mystic-purple)] transition-all duration-[2500ms] ease-linear"
            style={{
              width: `${((stepIndex + 1) / ANALYSIS_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
