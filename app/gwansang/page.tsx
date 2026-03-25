"use client";

import { useState, useCallback, useEffect } from "react";
import type { AnalysisState, GwansangReading } from "@/lib/gwansang/types";
import FaceCapture from "@/components/gwansang/FaceCapture";
import AnalysisProgress from "@/components/gwansang/AnalysisProgress";
import ReadingResult from "@/components/gwansang/ReadingResult";
import { track } from "@/lib/analytics";
import { getSessionId } from "@/lib/session";

export default function GwansangPage() {
  const [state, setState] = useState<AnalysisState>({
    status: "idle",
    imageData: null,
    reading: null,
    error: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [readingId, setReadingId] = useState<string | null>(null);

  useEffect(() => {
    track.gwansangPageViewed();
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

  const handleCapture = useCallback((base64: string, preview: string) => {
    track.gwansangPhotoTaken();
    setState((prev) => ({
      ...prev,
      status: "capturing",
      imageData: base64,
      error: null,
    }));
    setPreviewUrl(preview);
  }, []);

  const handleAnalyze = async () => {
    if (!state.imageData || state.status === "analyzing") return;

    track.gwansangAnalysisStarted();
    setState((prev) => ({ ...prev, status: "analyzing", error: null }));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120_000); // 2 min timeout

    try {
      const response = await fetch("/api/gwansang/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": getSessionId(),
        },
        body: JSON.stringify({
          imageBase64: state.imageData,
          mimeType: previewUrl.match(/^data:([^;]+);/)?.[1] ?? "image/jpeg",
        }),
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

      const data = (await response.json()) as { reading: GwansangReading; readingId?: string };

      track.gwansangAnalysisCompleted({
        nickname: data.reading.funTags?.nickname,
        sexAppeal: data.reading.viralScores?.sexAppeal,
        sharpMind: data.reading.viralScores?.sharpMind,
        wealthPotential: data.reading.viralScores?.wealthPotential,
      });

      setReadingId(data.readingId ?? null);
      setState((prev) => ({
        ...prev,
        status: "complete",
        reading: data.reading,
      }));
    } catch (err) {
      clearTimeout(timeoutId);
      let errorMsg = "알 수 없는 오류가 발생했습니다.";
      if (err instanceof DOMException && err.name === "AbortError") {
        errorMsg = "분석 시간이 초과되었습니다. 다시 시도해주세요.";
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      track.gwansangAnalysisFailed(errorMsg);
      setState((prev) => ({
        ...prev,
        status: "error",
        error: errorMsg,
      }));
    }
  };

  const handleReset = () => {
    track.resetClicked("gwansang");
    setState({
      status: "idle",
      imageData: null,
      reading: null,
      error: null,
    });
    setPreviewUrl("");
  };

  return (
    <div className="min-h-screen">
      <header className="text-center pt-12 pb-6 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-sacred-gold)]/10 border border-[var(--color-sacred-gold)]/20 text-xs text-[var(--color-sacred-gold)] mb-4">
          AI 관상
        </div>
        <h1 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-gold-gradient mb-2">
          얼굴이 말하는 당신의 운명
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          전통 관상학의 지혜 &middot; AI의 눈
        </p>
      </header>

      <div className="max-w-lg mx-auto px-4">
        {(state.status === "idle" || state.status === "capturing") && (
          <div className="space-y-6">
            {state.status === "idle" && (
              <div className="text-center space-y-4 mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-sacred-gold)] animate-pulse" />
                  12궁 &middot; 삼정 &middot; 오관 분석
                </div>
                <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto leading-relaxed">
                  수백 년간 전해 내려온 한국 전통 관상학의 지혜를
                  <br />
                  AI 기술로 경험해보세요.
                </p>
              </div>
            )}

            <FaceCapture onCapture={handleCapture} disabled={false} />

            {state.status === "capturing" && (
              <button
                onClick={handleAnalyze}
                className="w-full py-4 rounded-xl bg-[var(--color-sacred-gold)] text-[var(--color-bg-base)] font-bold text-base hover:brightness-110 transition animate-fade-in-up"
              >
                관상 분석 시작하기
              </button>
            )}

            {state.status === "idle" && (
              <div className="pt-8 pb-4">
                <h2 className="font-[family-name:var(--font-serif)] text-center text-sm font-bold text-[var(--color-text-muted)] mb-6">
                  이용 방법
                </h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { step: "1", title: "사진 촬영", desc: "정면 얼굴 사진을\n촬영하거나 업로드" },
                    { step: "2", title: "AI 분석", desc: "12궁, 삼정, 오관\n전통 관상학 분석" },
                    { step: "3", title: "결과 확인", desc: "성격, 운세, 조언\n상세 리포트 제공" },
                  ].map((item) => (
                    <div key={item.step} className="space-y-2">
                      <div className="w-10 h-10 rounded-full border border-[var(--color-sacred-gold)]/30 flex items-center justify-center mx-auto">
                        <span className="text-sm font-bold text-[var(--color-sacred-gold)]">
                          {item.step}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] whitespace-pre-line">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {state.status === "analyzing" && <AnalysisProgress />}

        {state.status === "error" && (
          <div className="text-center space-y-4 py-12">
            <div className="w-16 h-16 rounded-full bg-[var(--color-crimson)]/10 flex items-center justify-center mx-auto">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-sm text-[var(--color-crimson)]">{state.error}</p>
            <button
              onClick={handleReset}
              className="py-3 px-6 rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold text-sm hover:border-[var(--color-sacred-gold)]/50 transition"
            >
              다시 시도하기
            </button>
          </div>
        )}

        {state.status === "complete" && state.reading && (
          <ReadingResult
            reading={state.reading}
            imageUrl={previewUrl}
            onReset={handleReset}
            readingId={readingId}
          />
        )}
      </div>
    </div>
  );
}
