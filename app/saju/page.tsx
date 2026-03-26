"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import SajuAnalysisProgress from "@/components/saju/AnalysisProgress";
import type {
  SajuInput,
  SajuReading,
  SajuAnalysisState,
  FortuneCategory,
  DestinyEvent,
  MonthlyFortune,
  RawPillarInfo,
} from "@/lib/saju/types";
import type {
  PreComputedSaju,
  TwelveStageInfo,
  SinsalInfo,
  PillarTenGods,
  PillarData,
} from "@/lib/saju/calculators/types";

/** Subset of PreComputedSaju sent to frontend */
type SajuChart = Pick<
  PreComputedSaju,
  | "pillars" | "tenGods" | "twelveStages" | "sinsalsByPosition"
  | "dayMaster" | "strength" | "yongShen" | "elementBalance"
  | "majorLuck" | "yearlyLuck" | "relations" | "sinsals"
>;
import SajuShareCard, { type SajuCardHandle } from "@/components/saju/SajuShareCard";
import ShareButtons from "@/components/ShareButtons";
import { getSessionId } from "@/lib/session";

// ─── Constants ──────────────────────────────────────────

const HOURS = [
  { value: -1, label: "모름" },
  { value: 0, label: "자시 (23:00-01:00)" },
  { value: 2, label: "축시 (01:00-03:00)" },
  { value: 4, label: "인시 (03:00-05:00)" },
  { value: 6, label: "묘시 (05:00-07:00)" },
  { value: 8, label: "진시 (07:00-09:00)" },
  { value: 10, label: "사시 (09:00-11:00)" },
  { value: 12, label: "오시 (11:00-13:00)" },
  { value: 14, label: "미시 (13:00-15:00)" },
  { value: 16, label: "신시 (15:00-17:00)" },
  { value: 18, label: "유시 (17:00-19:00)" },
  { value: 20, label: "술시 (19:00-21:00)" },
  { value: 22, label: "해시 (21:00-23:00)" },
];

const ELEMENT_COLORS: Record<string, string> = {
  wood: "#22c55e",
  fire: "#ef4444",
  earth: "#eab308",
  metal: "#94a3b8",
  water: "#3b82f6",
};

const ELEMENT_LABELS: Record<string, string> = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
};

const GRADE_COLORS: Record<string, string> = {
  SSS: "#fbbf24",
  SS: "#f59e0b",
  S: "#a78bfa",
  A: "#60a5fa",
  B: "#34d399",
  C: "#94a3b8",
};

// ─── Utility Components ─────────────────────────────────

function ElementBar({ element, value }: { element: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--color-text-secondary)] w-6">
        {ELEMENT_LABELS[element]}
      </span>
      <div className="flex-1 h-2.5 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%`, backgroundColor: ELEMENT_COLORS[element] }}
        />
      </div>
      <span className="text-xs text-[var(--color-text-muted)] w-8 text-right font-mono">
        {value}
      </span>
    </div>
  );
}

function FortuneRow({
  icon,
  title,
  fortune,
}: {
  icon: string;
  title: string;
  fortune: FortuneCategory;
}) {
  return (
    <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h4 className="font-semibold text-sm text-[var(--color-text-primary)]">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)]">
            상위 {fortune.percentile}%
          </span>
          <span className="text-lg font-bold text-[var(--color-mystic-purple-light)] font-mono">
            {fortune.score}
          </span>
        </div>
      </div>
      <p className="text-sm text-[var(--color-sacred-gold)] mb-2">{fortune.summary}</p>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
        {fortune.detail}
      </p>
      <div className="text-xs text-[var(--color-teal)] bg-[var(--color-teal)]/5 px-3 py-2 rounded-lg">
        {fortune.advice}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: DestinyEvent }) {
  const sentimentColor =
    event.sentiment === "positive"
      ? "text-[#22c55e]"
      : event.sentiment === "negative"
        ? "text-[var(--color-crimson)]"
        : "text-[var(--color-text-secondary)]";
  const sentimentBg =
    event.sentiment === "positive"
      ? "bg-[#22c55e]/5 border-[#22c55e]/20"
      : event.sentiment === "negative"
        ? "bg-[var(--color-crimson)]/5 border-[var(--color-crimson)]/20"
        : "bg-[var(--color-bg-card)] border-[var(--color-border)]";

  return (
    <div className={`p-4 rounded-xl border ${sentimentBg}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--color-mystic-purple)]/10 text-[var(--color-mystic-purple-light)] font-semibold">
          {event.month}월
        </span>
        <span className="text-xs text-[var(--color-text-muted)]">{event.category}</span>
      </div>
      <p className={`text-sm font-semibold mb-1 ${sentimentColor}`}>{event.headline}</p>
      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
        {event.detail}
      </p>
    </div>
  );
}

function MonthCell({ m }: { m: MonthlyFortune }) {
  return (
    <div className="p-2.5 rounded-lg bg-[var(--color-bg-base)] text-center">
      <span className="text-xs text-[var(--color-text-muted)]">{m.month}월</span>
      <p className="text-xs font-semibold text-[var(--color-text-primary)] mt-0.5">
        {m.keyword}
      </p>
      <div className="flex justify-center gap-0.5 mt-1">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`text-[10px] ${
              i < m.rating
                ? "text-[var(--color-mystic-purple-light)]"
                : "text-[var(--color-bg-elevated)]"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <p className="text-[10px] text-[var(--color-text-muted)] mt-1 leading-tight">
        {m.action}
      </p>
    </div>
  );
}

function ChapterHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon: string }) {
  return (
    <div className="text-center pt-4 pb-1">
      <div className="inline-flex items-center gap-2 text-xs text-[var(--color-text-muted)] uppercase tracking-widest font-semibold">
        <span className="w-8 h-px bg-[var(--color-border)]" />
        <span>{icon}</span>
        <span>{title}</span>
        <span className="w-8 h-px bg-[var(--color-border)]" />
      </div>
      {subtitle && (
        <p className="text-xs text-[var(--color-text-muted)] mt-1">{subtitle}</p>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────

export default function SajuPage() {
  const cardRef = useRef<SajuCardHandle>(null);
  const [state, setState] = useState<SajuAnalysisState>({
    status: "idle",
    input: null,
    reading: null,
    error: null,
  });
  const [readingId, setReadingId] = useState<string | null>(null);
  const [sajuChart, setSajuChart] = useState<SajuChart | null>(null);

  useEffect(() => {
    track.sajuPageViewed();
  }, []);

  // Warn user before leaving during analysis to prevent wasted API calls
  useEffect(() => {
    if (state.status !== "analyzing") return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [state.status]);

  const [form, setForm] = useState({
    name: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    birthHour: "-1",
    gender: "" as "" | "male" | "female",
    calendarType: "solar" as "solar" | "lunar",
    birthPlace: "",
    currentConcern: "",
  });
  const [showOptional, setShowOptional] = useState(false);

  const birthYear = parseInt(form.birthYear);
  const birthMonth = parseInt(form.birthMonth);
  const birthDay = parseInt(form.birthDay);

  const isFormValid =
    form.name.trim() !== "" &&
    !isNaN(birthYear) && birthYear >= 1920 && birthYear <= new Date().getFullYear() &&
    !isNaN(birthMonth) && birthMonth >= 1 && birthMonth <= 12 &&
    !isNaN(birthDay) && birthDay >= 1 && birthDay <= 31 &&
    (form.gender === "male" || form.gender === "female");

  const handleAnalyze = async () => {
    if (!isFormValid || state.status === "analyzing") return;

    const input: SajuInput = {
      name: form.name,
      birthYear,
      birthMonth,
      birthDay,
      birthHour: parseInt(form.birthHour),
      birthMinute: 0,
      gender: form.gender as "male" | "female",
      calendarType: form.calendarType,
      ...(form.birthPlace.trim() && { birthPlace: form.birthPlace.trim() }),
      ...(form.currentConcern.trim() && { currentConcern: form.currentConcern.trim() }),
    };

    track.sajuFormSubmitted({ gender: form.gender, calendarType: form.calendarType });
    track.sajuAnalysisStarted();
    setState({ status: "analyzing", input, reading: null, error: null });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120_000); // 2 min timeout

    try {
      const response = await fetch("/api/saju/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": getSessionId(),
        },
        body: JSON.stringify(input),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMsg = "분석에 실패했습니다.";
        try {
          const data = await response.json();
          errorMsg = data.error ?? errorMsg;
        } catch { /* response body not JSON */ }
        throw new Error(errorMsg);
      }

      const data = (await response.json()) as {
        reading: SajuReading;
        cached?: boolean;
        readingId?: string;
        sajuChart?: SajuChart;
      };
      track.sajuAnalysisCompleted({
        destinyType: data.reading.destinyType?.title,
        grade: data.reading.overallGrade?.grade,
        cached: data.cached ?? false,
      });
      setReadingId(data.readingId ?? null);
      setSajuChart(data.sajuChart ?? null);
      setState({ status: "complete", input, reading: data.reading, error: null });
    } catch (err) {
      clearTimeout(timeoutId);
      let errorMsg = "알 수 없는 오류가 발생했습니다.";
      if (err instanceof DOMException && err.name === "AbortError") {
        errorMsg = "분석 시간이 초과되었습니다. 다시 시도해주세요.";
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      track.sajuAnalysisFailed(errorMsg);
      setState({
        status: "error",
        input,
        reading: null,
        error: errorMsg,
      });
    }
  };

  const handleReset = () => {
    track.resetClicked("saju");
    setState({ status: "idle", input: null, reading: null, error: null });
  };

  const r = state.reading;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="text-center pt-12 pb-6 px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-mystic-purple)]/10 border border-[var(--color-mystic-purple)]/20 text-xs text-[var(--color-mystic-purple-light)] mb-4"
        >
          3-System Convergence
        </Link>
        <h1 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-purple-gradient mb-2">
          운명교차점
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          동서양 3대 운명학이 만나는 순간 — 당신만의 에너지 지도
        </p>
      </header>

      <div className="max-w-lg mx-auto px-4 pb-16">
        {/* ── INPUT FORM ── */}
        {(state.status === "idle" || state.status === "input") && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">
                  이름
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="이름을 입력하세요"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-mystic-purple)]/50 transition"
                />
              </div>

              {/* Calendar Type */}
              <div>
                <label className="text-sm text-[var(--color-text-secondary)] mb-2 block">
                  달력
                </label>
                <div className="flex gap-2">
                  {(["solar", "lunar"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setForm({ ...form, calendarType: type })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                        form.calendarType === type
                          ? "bg-[var(--color-mystic-purple)] text-white"
                          : "bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {type === "solar" ? "양력" : "음력"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">
                  생년월일
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={form.birthYear}
                    onChange={(e) => setForm({ ...form, birthYear: e.target.value })}
                    placeholder="년 (1990)"
                    min="1920"
                    max="2026"
                    className="px-3 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm text-center focus:outline-none focus:border-[var(--color-mystic-purple)]/50 transition"
                  />
                  <input
                    type="number"
                    value={form.birthMonth}
                    onChange={(e) => setForm({ ...form, birthMonth: e.target.value })}
                    placeholder="월"
                    min="1"
                    max="12"
                    className="px-3 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm text-center focus:outline-none focus:border-[var(--color-mystic-purple)]/50 transition"
                  />
                  <input
                    type="number"
                    value={form.birthDay}
                    onChange={(e) => setForm({ ...form, birthDay: e.target.value })}
                    placeholder="일"
                    min="1"
                    max="31"
                    className="px-3 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm text-center focus:outline-none focus:border-[var(--color-mystic-purple)]/50 transition"
                  />
                </div>
              </div>

              {/* Birth Hour */}
              <div>
                <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">
                  태어난 시간
                </label>
                <select
                  value={form.birthHour}
                  onChange={(e) => setForm({ ...form, birthHour: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-mystic-purple)]/50 transition"
                >
                  {HOURS.map((h) => (
                    <option key={h.value} value={h.value}>
                      {h.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm text-[var(--color-text-secondary)] mb-2 block">
                  성별
                </label>
                <div className="flex gap-2">
                  {(["male", "female"] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setForm({ ...form, gender: g })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                        form.gender === g
                          ? "bg-[var(--color-mystic-purple)] text-white"
                          : "bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {g === "male" ? "남성" : "여성"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Fields Toggle */}
              <button
                type="button"
                onClick={() => setShowOptional(!showOptional)}
                className="w-full flex items-center justify-center gap-1 text-xs text-[var(--color-mystic-purple-light)] hover:text-[var(--color-mystic-purple)] transition"
              >
                <span>{showOptional ? "접기" : "더 정확한 분석을 원하시면 (선택)"}</span>
                <svg className={`w-3 h-3 transition-transform ${showOptional ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {showOptional && (
                <div className="space-y-4 animate-fade-in-up">
                  {/* Birth Place */}
                  <div>
                    <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">
                      태어난 곳 <span className="text-xs text-[var(--color-text-muted)]">(진태양시 보정 · Vedic 차트용)</span>
                    </label>
                    <input
                      type="text"
                      value={form.birthPlace}
                      onChange={(e) => setForm({ ...form, birthPlace: e.target.value })}
                      placeholder="예: 서울, 부산, Toronto"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-mystic-purple)]/50 transition"
                    />
                  </div>


                  {/* Current Concern */}
                  <div>
                    <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">
                      현재 고민 <span className="text-xs text-[var(--color-text-muted)]">(주역 점괘용)</span>
                    </label>
                    <textarea
                      value={form.currentConcern}
                      onChange={(e) => setForm({ ...form, currentConcern: e.target.value })}
                      placeholder="예: 이직을 해야 할지 고민입니다"
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-mystic-purple)]/50 transition resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!isFormValid}
              className={`w-full py-4 rounded-xl font-bold text-base transition ${
                isFormValid
                  ? "bg-[var(--color-mystic-purple)] text-white hover:brightness-110"
                  : "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] cursor-not-allowed"
              }`}
            >
              운명 분석 시작하기
            </button>
          </div>
        )}

        {/* ── ANALYZING ── */}
        {state.status === "analyzing" && (
          <SajuAnalysisProgress name={state.input?.name ?? ""} />
        )}

        {/* ── ERROR ── */}
        {state.status === "error" && (
          <div className="text-center space-y-4 py-12">
            <div className="w-16 h-16 rounded-full bg-[var(--color-crimson)]/10 flex items-center justify-center mx-auto">
              <span className="text-3xl">⚠</span>
            </div>
            <p className="text-sm text-[var(--color-crimson)]">{state.error}</p>
            <button
              onClick={handleReset}
              className="py-3 px-6 rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold text-sm hover:border-[var(--color-mystic-purple)]/50 transition"
            >
              다시 시도하기
            </button>
          </div>
        )}

        {/* ── RESULTS ── */}
        {state.status === "complete" && r && (
          <div className="space-y-5 animate-fade-in-up">
            {/* Destiny Card (shareable image) */}
            <SajuShareCard ref={cardRef} reading={r} name={state.input?.name ?? ""} />

            {/* Share Buttons */}
            <ShareButtons
              canvasRef={{ get current() { return cardRef.current?.getCanvas() ?? null; } } as React.RefObject<HTMLCanvasElement | null>}
              type="saju"
              nickname={r.destinyType?.title}
              accent="var(--color-mystic-purple)"
              readingId={readingId}
            />

            {/* ═══ HERO: Triple Convergence (3대 시스템 합의점) ═══ */}
            {r.quadConvergence && (
              <section className="relative p-6 rounded-2xl bg-gradient-to-b from-[var(--color-teal)]/15 to-[var(--color-bg-card)] border border-[var(--color-teal)]/30 overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,var(--color-teal)_0%,transparent_70%)]" />
                <div className="relative">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <h3 className="font-[family-name:var(--font-serif)] font-bold text-sm text-[var(--color-teal)]">
                      3대 시스템 합의점
                    </h3>
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[var(--color-teal)]/10 text-[var(--color-teal)]">
                      {r.quadConvergence.agreementLevel}/3 일치
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] text-center mb-2">
                    동서양 운명학이 한 목소리로 말하는 핵심 운명
                  </p>
                  <div className="text-center mb-4">
                    <p className="text-2xl font-bold text-[var(--color-text-primary)] font-[family-name:var(--font-serif)]">
                      {r.quadConvergence.energyVerdictKr}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      수렴: {r.quadConvergence.convergingSystems.join(" · ")}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                    {r.quadConvergence.coreMessage}
                  </p>
                  <div className="p-3 rounded-lg bg-[var(--color-teal)]/5 border border-[var(--color-teal)]/20 mb-3">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">지금 딱 하나만 한다면</p>
                    <p className="text-sm font-semibold text-[var(--color-teal)]">
                      {r.quadConvergence.oneAction}
                    </p>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] italic leading-relaxed">
                    {r.quadConvergence.crossInsight}
                  </p>
                </div>
              </section>
            )}

            {/* ═══ 만세력 — Full Saju Chart ═══ */}
            {sajuChart && (() => {
              const positions = ["hour", "day", "month", "year"] as const;
              const posLabels = { hour: "시주", day: "일주", month: "월주", year: "년주" };
              const stemElementColor: Record<string, string> = {
                "甲": "#22c55e", "乙": "#22c55e", // wood - green
                "丙": "#ef4444", "丁": "#ef4444", // fire - red
                "戊": "#eab308", "己": "#eab308", // earth - yellow
                "庚": "#94a3b8", "辛": "#94a3b8", // metal - gray
                "壬": "#3b82f6", "癸": "#3b82f6", // water - blue
              };
              const branchElementColor: Record<string, string> = {
                "子": "#3b82f6", "丑": "#eab308", "寅": "#22c55e", "卯": "#22c55e",
                "辰": "#eab308", "巳": "#ef4444", "午": "#ef4444", "未": "#eab308",
                "申": "#94a3b8", "酉": "#94a3b8", "戌": "#eab308", "亥": "#3b82f6",
              };
              return (
                <section className="p-4 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                  <h3 className="font-semibold text-sm text-[var(--color-sacred-gold)] mb-3 text-center">
                    만세력
                  </h3>
                  {/* Column headers */}
                  <div className="grid grid-cols-[48px_repeat(4,1fr)] gap-0.5 text-center">
                    <div />
                    {positions.map((pos) => (
                      <div key={pos} className="text-[11px] text-[var(--color-text-muted)] py-1 font-medium">{posLabels[pos]}</div>
                    ))}

                    {/* 천간 row */}
                    <div className="flex items-center justify-center text-[10px] text-[var(--color-text-muted)]">천간</div>
                    {positions.map((pos) => {
                      const p = sajuChart?.pillars?.[pos];
                      const tg = sajuChart?.tenGods?.[pos];
                      const isDayMaster = pos === "day";
                      return (
                        <div key={`stem-${pos}`} className={`py-2.5 rounded-md ${isDayMaster ? "bg-[var(--color-mystic-purple)]/15 border border-[var(--color-mystic-purple)]/30" : "bg-[var(--color-bg-base)]"}`}>
                          <p className="text-2xl font-bold font-[family-name:var(--font-serif)]" style={{ color: stemElementColor[p?.stem ?? ""] ?? "inherit" }}>{p?.stem ?? "?"}</p>
                          <p className="text-[10px] text-[var(--color-text-muted)]">{p?.stemKr ?? "?"}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: isDayMaster ? "var(--color-mystic-purple-light)" : "var(--color-text-secondary)" }}>
                            {isDayMaster ? "일주" : tg?.stem?.tenGod?.korean ?? ""}
                          </p>
                        </div>
                      );
                    })}

                    {/* 지지 row */}
                    <div className="flex items-center justify-center text-[10px] text-[var(--color-text-muted)]">지지</div>
                    {positions.map((pos) => {
                      const p = sajuChart?.pillars?.[pos];
                      const tg = sajuChart?.tenGods?.[pos];
                      const isDayMaster = pos === "day";
                      return (
                        <div key={`branch-${pos}`} className={`py-2.5 rounded-md ${isDayMaster ? "bg-[var(--color-mystic-purple)]/10 border border-[var(--color-mystic-purple)]/20" : "bg-[var(--color-bg-base)]"}`}>
                          <p className="text-2xl font-bold font-[family-name:var(--font-serif)]" style={{ color: branchElementColor[p?.branch ?? ""] ?? "inherit" }}>{p?.branch ?? "?"}</p>
                          <p className="text-[10px] text-[var(--color-text-muted)]">{p?.branchKr ?? "?"}</p>
                          <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">{tg?.branch?.tenGod?.korean ?? ""}</p>
                        </div>
                      );
                    })}

                    {/* 지장간 row (hidden stems) */}
                    <div className="flex items-center justify-center text-[10px] text-[var(--color-text-muted)]">지장간</div>
                    {positions.map((pos) => {
                      const tg = sajuChart?.tenGods?.[pos];
                      return (
                        <div key={`hidden-${pos}`} className="py-1.5 rounded-md bg-[var(--color-bg-base)]">
                          {(tg?.branch?.hiddenStems ?? []).map((hs, i) => (
                            <p key={i} className="text-[10px] text-[var(--color-text-secondary)]">
                              <span className="font-medium" style={{ color: stemElementColor[hs?.stem ?? ""] ?? "inherit" }}>{hs?.stem ?? ""}</span>
                              <span className="text-[var(--color-text-muted)]"> {hs?.tenGod?.korean ?? ""}</span>
                            </p>
                          ))}
                        </div>
                      );
                    })}

                    {/* 12운성 row */}
                    <div className="flex items-center justify-center text-[10px] text-[var(--color-text-muted)]">12운성</div>
                    {positions.map((pos) => {
                      const stage = sajuChart?.twelveStages?.[pos];
                      const stageColor = stage?.strength === "strong" ? "#22c55e" : stage?.strength === "weak" ? "#ef4444" : "var(--color-text-secondary)";
                      return (
                        <div key={`stage-${pos}`} className="py-1.5 rounded-md bg-[var(--color-bg-base)]">
                          <p className="text-[11px] font-medium" style={{ color: stageColor }}>{stage?.korean ?? "-"}</p>
                        </div>
                      );
                    })}

                    {/* 신살 row */}
                    <div className="flex items-center justify-center text-[10px] text-[var(--color-text-muted)]">신살</div>
                    {positions.map((pos) => {
                      const sinsals = sajuChart?.sinsalsByPosition?.[pos] ?? [];
                      return (
                        <div key={`sinsal-${pos}`} className="py-1 rounded-md bg-[var(--color-bg-base)]">
                          {sinsals.length > 0 ? sinsals.slice(0, 2).map((s, i) => (
                            <p key={i} className="text-[9px] leading-tight" style={{ color: s?.type === "auspicious" ? "#22c55e" : s?.type === "inauspicious" ? "#ef4444" : "var(--color-text-secondary)" }}>
                              {s?.korean ?? "-"}
                            </p>
                          )) : <p className="text-[9px] text-[var(--color-text-muted)]">-</p>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Strength + YongShen + Element Balance */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="p-2 rounded-lg bg-[var(--color-bg-base)] text-center">
                      <p className="text-[10px] text-[var(--color-text-muted)]">신강/신약</p>
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">{sajuChart?.strength?.levelKr ?? "-"}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{sajuChart?.strength?.score ?? 0}점</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[var(--color-bg-base)] text-center">
                      <p className="text-[10px] text-[var(--color-text-muted)]">용신</p>
                      <p className="text-sm font-bold text-[var(--color-sacred-gold)]">{sajuChart?.yongShen?.primary?.korean ?? ""}</p>
                      {sajuChart?.yongShen?.secondary && (
                        <p className="text-[10px] text-[var(--color-text-muted)]">보: {sajuChart.yongShen.secondary?.korean ?? ""}</p>
                      )}
                    </div>
                    <div className="p-2 rounded-lg bg-[var(--color-bg-base)] text-center">
                      <p className="text-[10px] text-[var(--color-text-muted)]">일간</p>
                      <p className="text-sm font-bold" style={{ color: stemElementColor[sajuChart?.dayMaster?.stem ?? ""] ?? "inherit" }}>
                        {sajuChart?.dayMaster?.stem ?? ""} {sajuChart?.dayMaster?.stemKr ?? ""}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{sajuChart?.dayMaster?.elementKr ?? ""} {sajuChart?.dayMaster?.polarityKr ?? ""}</p>
                    </div>
                  </div>

                  {/* 오행 balance bar */}
                  <div className="mt-3">
                    <div className="flex gap-0.5 h-3 rounded-full overflow-hidden">
                      {(["wood", "fire", "earth", "metal", "water"] as const).map((el) => (
                        <div key={el} style={{ width: `${sajuChart?.elementBalance?.[el] ?? 20}%`, backgroundColor: ELEMENT_COLORS[el] }} className="transition-all" />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1">
                      {(["wood", "fire", "earth", "metal", "water"] as const).map((el) => (
                        <span key={el} className="text-[9px]" style={{ color: ELEMENT_COLORS[el] }}>{ELEMENT_LABELS[el]} {sajuChart?.elementBalance?.[el] ?? 20}%</span>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* Four Pillars AI Interpretation */}
            {r.fourPillarsAnalysis && (
              <section className="p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                <h3 className="font-semibold text-sm text-[var(--color-sacred-gold)] mb-4">
                  사주팔자 해석
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "년주", icon: "🌳", data: r.fourPillarsAnalysis.yearPillar },
                    { label: "월주", icon: "🌙", data: r.fourPillarsAnalysis.monthPillar },
                    { label: "일주", icon: "☀️", data: r.fourPillarsAnalysis.dayPillar },
                    { label: "시주", icon: "⭐", data: r.fourPillarsAnalysis.hourPillar },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-lg bg-[var(--color-bg-base)]">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{item.icon}</span>
                        <span className="text-xs font-semibold text-[var(--color-mystic-purple-light)]">{item.label}</span>
                        <span className="text-xs text-[var(--color-text-muted)] font-mono">{item.data.pillar}</span>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.data.meaning}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-[var(--color-mystic-purple)]/5 border border-[var(--color-mystic-purple)]/20">
                  <p className="text-xs text-[var(--color-text-muted)] mb-1 font-semibold">네 기둥의 상호작용</p>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {r.fourPillarsAnalysis.pillarsInterplay}
                  </p>
                </div>
              </section>
            )}

            {/* ═══ CH1: 당신의 본질 ═══ */}
            <ChapterHeader icon="✦" title="당신의 본질" />

            {/* Destiny Type Hero */}
            <section className="relative p-6 rounded-2xl bg-gradient-to-b from-[var(--color-mystic-purple)]/15 to-[var(--color-bg-card)] border border-[var(--color-mystic-purple)]/30 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,var(--color-mystic-purple)_0%,transparent_70%)]" />
              <div className="relative">
                <p className="text-xs text-[var(--color-text-muted)] mb-3">
                  {state.input?.name}님의 운명 유형
                </p>
                <div className="text-6xl font-bold font-[family-name:var(--font-serif)] text-purple-gradient mb-2">
                  {r.destinyType?.hanja ?? "?"}
                </div>
                <p className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
                  {r.destinyType?.title ?? "운명 유형"}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs mx-auto">
                  {r.destinyType?.description ?? ""}
                </p>
              </div>
            </section>

            {/* Grade Badge */}
            <section className="p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] text-center">
              <p className="text-xs text-[var(--color-text-muted)] mb-2">종합 운세 등급</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span
                  className="text-4xl font-black font-mono tracking-tighter"
                  style={{ color: GRADE_COLORS[r.overallGrade?.grade ?? ""] ?? "#94a3b8" }}
                >
                  {r.overallGrade?.grade ?? "-"}
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    상위 {r.overallGrade?.nationalPercentile ?? "?"}%
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">전국 기준</p>
                </div>
              </div>
              <p className="text-sm text-[var(--color-sacred-gold)]">
                {r.overallGrade?.comment ?? ""}
              </p>
            </section>

            {/* Day Master + Element Balance */}
            <section className="p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
              <div className="text-center mb-4">
                <p className="text-xs text-[var(--color-mystic-purple-light)] mb-1">일간</p>
                <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-purple-gradient">
                  {r.dayMaster}
                </h2>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-5">
                {r.dayMasterDescription}
              </p>
              <h3 className="font-semibold text-xs text-[var(--color-text-muted)] mb-3 uppercase tracking-wider">
                오행 밸런스
              </h3>
              <div className="space-y-2.5">
                {(["wood", "fire", "earth", "metal", "water"] as const).map((el) => (
                  <ElementBar key={el} element={el} value={r.elementBalance[el]} />
                ))}
              </div>
            </section>

            {/* Personality */}
            <section className="p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
              <h3 className="font-semibold text-sm text-[var(--color-sacred-gold)] mb-3">
                성격 분석
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {r.personality}
              </p>
            </section>

            {/* Hidden Self */}
            <section className="p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
              <h3 className="font-semibold text-sm text-[var(--color-sacred-gold)] mb-3">
                숨겨진 매력과 재능
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                {r.hiddenSelf?.outerVsInner}
              </p>
              <div className="space-y-2 mb-4">
                <p className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
                  숨겨진 재능
                </p>
                {r.hiddenSelf?.talents.map((talent, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]"
                  >
                    <span className="text-[var(--color-mystic-purple-light)] mt-0.5">
                      {i + 1}.
                    </span>
                    <span>{talent}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-[var(--color-sacred-gold)]/5 border border-[var(--color-sacred-gold)]/20">
                <p className="text-xs text-[var(--color-text-muted)] mb-1">조선시대 전생</p>
                <p className="text-sm text-[var(--color-sacred-gold)]">
                  {r.hiddenSelf?.pastLife}
                </p>
              </div>
            </section>

            {/* ═══ CH2: 인생의 흐름 ═══ */}
            <ChapterHeader icon="〰" title="인생의 흐름" subtitle="연애, 재물, 직업 — 당신의 에너지가 향하는 곳" />

            {/* Life Narrative */}
            <section className="p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
              <h3 className="font-semibold text-sm text-[var(--color-sacred-gold)] mb-4">
                인생 서사
              </h3>
              <div className="relative pl-4 border-l-2 border-[var(--color-mystic-purple)]/30 space-y-4">
                <div>
                  <p className="text-xs text-[var(--color-mystic-purple-light)] font-semibold mb-1">
                    초년 (1-30세)
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {r.lifeNarrative?.past}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-mystic-purple-light)] font-semibold mb-1">
                    중년 (31-50세)
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {r.lifeNarrative?.present}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-mystic-purple-light)] font-semibold mb-1">
                    말년 (51세~)
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {r.lifeNarrative?.future}
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-[var(--color-mystic-purple)]/5 text-center">
                <p className="text-sm font-semibold text-[var(--color-mystic-purple-light)] italic">
                  &ldquo;{r.lifeNarrative?.lifeTheme}&rdquo;
                </p>
              </div>
            </section>

            {/* Fortune Scores */}
            <section className="space-y-3">
              <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">
                에너지 분석
              </h3>
              <FortuneRow icon="💕" title="감정 에너지 (연애)" fortune={r.fortunes.love} />
              <FortuneRow icon="💰" title="풍요 에너지 (재물)" fortune={r.fortunes.wealth} />
              <FortuneRow icon="🎯" title="재능 에너지 (직업)" fortune={r.fortunes.career} />
              <FortuneRow icon="⚡" title="생명 에너지 (건강)" fortune={r.fortunes.health} />
              <FortuneRow icon="👑" title="성취 에너지 (명예)" fortune={r.fortunes.fame} />
            </section>

            {/* ═══ CH3: 관계와 타이밍 ═══ */}
            <ChapterHeader icon="◈" title="관계와 타이밍" subtitle="누구와, 언제 — 운명의 교차점" />

            {/* Compatibility */}
            <section className="p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
              <h3 className="font-semibold text-sm text-[var(--color-sacred-gold)] mb-4">
                궁합 분석
              </h3>
              <div className="space-y-3">
                {[
                  { label: "최고의 파트너", data: r.compatibility?.best, color: "#22c55e" },
                  { label: "운명의 소울메이트", data: r.compatibility?.soulmate, color: "#ec4899" },
                  { label: "주의해야 할 유형", data: r.compatibility?.rival, color: "#ef4444" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-base)]"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-[family-name:var(--font-serif)] text-lg font-bold"
                      style={{ color: item.color, backgroundColor: `${item.color}15` }}
                    >
                      {item.data.typeHanja}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[var(--color-text-muted)]">{item.label}</p>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {item.data.typeName}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {item.data.reason}
                      </p>
                    </div>
                    <span
                      className="text-sm font-bold font-mono"
                      style={{ color: item.color }}
                    >
                      {item.data.score}%
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Yearly Fortune + Events */}
            <section className="p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">
                  {r.yearlyFortune?.year}년 운세
                </h3>
                <span
                  className="px-2 py-0.5 text-xs font-bold rounded-full font-mono"
                  style={{
                    color: GRADE_COLORS[r.yearlyFortune?.grade] ?? "#94a3b8",
                    backgroundColor: `${GRADE_COLORS[r.yearlyFortune?.grade] ?? "#94a3b8"}15`,
                  }}
                >
                  {r.yearlyFortune?.grade}
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--color-mystic-purple)]/10 text-[var(--color-mystic-purple-light)]">
                  {r.yearlyFortune?.keyword}
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                {r.yearlyFortune?.detail}
              </p>

              {r.yearlyFortune?.destinyEvents && r.yearlyFortune?.destinyEvents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
                    주요 운명 이벤트
                  </p>
                  {r.yearlyFortune?.destinyEvents.map((evt, i) => (
                    <EventCard key={i} event={evt} />
                  ))}
                </div>
              )}
            </section>

            {/* Monthly Grid */}
            {r.monthlyFortunes && r.monthlyFortunes.length > 0 && (
              <section className="p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                <h3 className="font-semibold text-sm text-[var(--color-text-primary)] mb-3">
                  월별 운세
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {r.monthlyFortunes.map((m) => (
                    <MonthCell key={m.month} m={m} />
                  ))}
                </div>
              </section>
            )}

            {/* ═══ CH4: 불편한 진실 ═══ */}
            <ChapterHeader icon="⚠" title="불편한 진실" subtitle="인정하기 싫지만 4개 시스템이 공통으로 경고합니다" />

            {/* Danger Warnings */}
            {r.dangerWarnings && r.dangerWarnings.length > 0 && (
              <section className="p-5 rounded-2xl bg-[var(--color-crimson)]/5 border border-[var(--color-crimson)]/20">
                <h3 className="font-semibold text-sm text-[var(--color-crimson)] mb-3">
                  주의 경고
                </h3>
                <div className="space-y-3">
                  {r.dangerWarnings.map((warn, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-crimson)]/10 text-[var(--color-crimson)] font-semibold">
                          {warn.period}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {warn.warning}
                      </p>
                      <p className="text-xs text-[var(--color-teal)]">
                        → {warn.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ═══ CH5: 심화 시스템 분석 ═══ */}
            <ChapterHeader icon="🔬" title="심화 시스템 분석" subtitle="사주 · Vedic · 주역 개별 분석" />

            {/* Vedic Dasha */}
            {r.vedicDasha && (
              <section className="p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🪐</span>
                  <h3 className="font-semibold text-sm text-[var(--color-sacred-gold)]">
                    Vedic Dasha — 행성 에너지 주기
                  </h3>
                </div>
                <div className="p-3 rounded-lg bg-[var(--color-bg-base)] mb-3">
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">출생 Nakshatra (별)</p>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {r.vedicDasha.nakshatra}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-3 rounded-lg bg-[var(--color-bg-base)]">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Mahadasha (대주기)</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {r.vedicDasha.mahadasha.planet}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {r.vedicDasha.mahadasha.startYear}-{r.vedicDasha.mahadasha.endYear}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                      {r.vedicDasha.mahadasha.meaning}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--color-bg-base)]">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Antardasha (소주기)</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {r.vedicDasha.antardasha.planet}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {r.vedicDasha.antardasha.startYear}-{r.vedicDasha.antardasha.endYear}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                      {r.vedicDasha.antardasha.meaning}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-2">
                  {r.vedicDasha.insight}
                </p>
                <div className="text-xs text-[var(--color-teal)] bg-[var(--color-teal)]/5 px-3 py-2 rounded-lg">
                  {r.vedicDasha.timingAdvice}
                </div>
              </section>
            )}

            {/* I Ching */}
            {r.iChing && (
              <section className="p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">☯</span>
                  <h3 className="font-semibold text-sm text-[var(--color-sacred-gold)]">
                    주역 — 변화의 지혜
                  </h3>
                </div>
                <div className="text-center p-4 rounded-lg bg-[var(--color-bg-base)] mb-3">
                  <p className="text-3xl font-[family-name:var(--font-serif)] mb-1">
                    {r.iChing.trigramSymbols}
                  </p>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">
                    {r.iChing.hexagramName}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {r.iChing.hexagramHanja} (제{r.iChing.hexagramNumber}괘)
                  </p>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                  {r.iChing.coreMeaning}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-3 rounded-lg bg-[var(--color-bg-base)]">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">
                      변효 ({r.iChing.changingLine.position}효)
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {r.iChing.changingLine.advice}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--color-bg-base)]">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">지괘 (미래 방향)</p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {r.iChing.transformedHexagram}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                  {r.iChing.guidance}
                </p>
                <div className="p-3 rounded-lg bg-[var(--color-mystic-purple)]/5 border border-[var(--color-mystic-purple)]/20 text-center">
                  <p className="text-sm font-semibold text-[var(--color-mystic-purple-light)]">
                    {r.iChing.actionVerdict}
                  </p>
                </div>
              </section>
            )}

            {/* ═══ CH6: 운세 활용법 ═══ */}
            <ChapterHeader icon="🚀" title="운세 활용법" subtitle="에너지를 극대화하는 실천 가이드" />

            {/* Luck Boosters */}
            {r.luckBoosters && r.luckBoosters.length > 0 && (
              <section className="p-5 rounded-2xl bg-[var(--color-mystic-purple)]/5 border border-[var(--color-mystic-purple)]/20">
                <h3 className="font-semibold text-sm text-[var(--color-mystic-purple-light)] mb-3">
                  지금 바로 운 올리는 법
                </h3>
                <div className="space-y-2">
                  {r.luckBoosters.map((boost, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg-card)]">
                      <span className="w-6 h-6 rounded-full bg-[var(--color-mystic-purple)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-mystic-purple-light)]">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                          {boost.action}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          {boost.effect}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Lucky Elements */}
            <section className="p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
              <h3 className="font-semibold text-sm text-[var(--color-text-primary)] mb-3">
                행운의 요소
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "색상", value: r.luckyElements?.color },
                  { label: "숫자", value: String(r.luckyElements?.number) },
                  { label: "방향", value: r.luckyElements?.direction },
                  { label: "계절", value: r.luckyElements?.season },
                  { label: "아이템", value: r.luckyElements?.item },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-2.5 rounded-lg bg-[var(--color-bg-base)]"
                  >
                    <p className="text-xs text-[var(--color-text-muted)]">{item.label}</p>
                    <p className="text-sm font-semibold text-[var(--color-sacred-gold)]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Share Keywords */}
            {r.shareKeywords && r.shareKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {r.shareKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-[var(--color-mystic-purple)]/10 text-[var(--color-mystic-purple-light)] border border-[var(--color-mystic-purple)]/20"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full py-3.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold text-sm hover:border-[var(--color-mystic-purple)]/50 transition"
            >
              다시 하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
