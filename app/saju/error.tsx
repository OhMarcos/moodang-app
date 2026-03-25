"use client";

import { useEffect } from "react";

export default function SajuError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[saju] Client error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          페이지 로드 중 오류가 발생했습니다
        </h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-left">
          <p className="text-sm font-mono text-red-800 break-all">
            {error.message}
          </p>
          {error.digest && (
            <p className="text-xs text-red-500 mt-2">Digest: {error.digest}</p>
          )}
        </div>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[var(--color-mystic-purple)] text-white rounded-xl font-semibold hover:brightness-110 transition"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
