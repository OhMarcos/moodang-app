"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";

export default function GwansangError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error("[gwansang] Client error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          {t("error.pageLoad")}
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
          {t("error.retry")}
        </button>
      </div>
    </div>
  );
}
