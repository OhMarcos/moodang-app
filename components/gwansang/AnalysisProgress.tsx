"use client";

import { useEffect, useState } from "react";

const ANALYSIS_STEPS = [
  "얼굴의 전체적인 인상을 살펴보고 있습니다...",
  "이마와 관록궁을 분석하고 있습니다...",
  "눈썹의 기운을 읽고 있습니다...",
  "눈(감찰관)의 빛을 살펴보고 있습니다...",
  "코(심판관)의 형상을 분석하고 있습니다...",
  "입(출납관)의 복을 읽고 있습니다...",
  "삼정의 균형을 확인하고 있습니다...",
  "오악과 오관을 종합하고 있습니다...",
  "12궁의 운세를 해석하고 있습니다...",
  "관상 분석을 마무리하고 있습니다...",
];

export default function AnalysisProgress() {
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
      {/* Spinning compass/trigram animation */}
      <div className="relative w-28 h-28">
        <div className="absolute inset-0 rounded-full border-2 border-[var(--color-gold)] opacity-20 animate-ping" />
        <div className="absolute inset-2 rounded-full border border-[var(--color-gold-dim)] opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className="animate-spin"
            style={{ animationDuration: "8s" }}
          >
            {/* Yin-yang inspired design */}
            <circle cx="24" cy="24" r="22" fill="none" stroke="var(--color-gold)" strokeWidth="1" opacity="0.6" />
            <circle cx="24" cy="24" r="16" fill="none" stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.4" />
            <path
              d="M24 2 A22 22 0 0 1 24 46 A11 11 0 0 0 24 24 A11 11 0 0 1 24 2"
              fill="var(--color-gold)"
              opacity="0.15"
            />
            <circle cx="24" cy="13" r="3" fill="var(--color-gold)" opacity="0.4" />
            <circle cx="24" cy="35" r="3" fill="none" stroke="var(--color-gold)" strokeWidth="1" opacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Step text */}
      <div className="text-center space-y-3">
        <h3
          className="font-[family-name:var(--font-serif)] text-lg text-[var(--color-gold)]"
        >
          관상 분석 중
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
            className="h-full bg-[var(--color-gold)] transition-all duration-[2500ms] ease-linear"
            style={{
              width: `${((stepIndex + 1) / ANALYSIS_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
