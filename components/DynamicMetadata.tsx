"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";

const titles: Record<string, { ko: string; en: string }> = {
  "/": {
    ko: "무당 MOODANG — AI 관상 & 사주 분석",
    en: "MOODANG — AI Face Reading & Destiny Analysis",
  },
  "/gwansang": {
    ko: "AI 관상 분석 — 무당 MOODANG",
    en: "AI Face Reading — MOODANG",
  },
  "/saju": {
    ko: "운명교차점 — 무당 MOODANG",
    en: "Destiny Crossroads — MOODANG",
  },
};

export default function DynamicMetadata() {
  const { locale } = useI18n();

  useEffect(() => {
    const path = window.location.pathname;
    const match = titles[path];
    if (match) {
      document.title = match[locale];
    }
  }, [locale]);

  return null;
}
