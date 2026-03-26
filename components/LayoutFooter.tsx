"use client";

import { useI18n } from "@/lib/i18n/context";

export default function LayoutFooter() {
  const { t } = useI18n();

  return (
    <footer className="text-center py-8 px-4 mt-8 border-t border-[var(--color-border)]">
      <p className="text-xs text-[var(--color-text-muted)]">
        {t("layout.disclaimer")}
      </p>
      <p className="text-xs text-[var(--color-text-muted)] mt-1 opacity-60">
        MOODANG
      </p>
    </footer>
  );
}
