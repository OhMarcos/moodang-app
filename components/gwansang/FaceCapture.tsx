"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { compressImage } from "@/lib/gwansang/utils";
import { useI18n } from "@/lib/i18n/context";

interface FaceCaptureProps {
  onCapture: (base64: string, previewUrl: string) => void;
  disabled?: boolean;
}

/** Detect mobile/tablet (iOS, Android) via user agent */
function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export default function FaceCapture({ onCapture, disabled }: FaceCaptureProps) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"select" | "camera" | "preview">("select");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  // Attach stream to video element when both are ready
  useEffect(() => {
    if (stream && videoRef.current && mode === "camera") {
      videoRef.current.srcObject = stream;
    }
  }, [stream, mode]);

  const startCamera = async () => {
    // On mobile: use native camera input (much more reliable on iOS)
    if (isMobileDevice()) {
      cameraInputRef.current?.click();
      return;
    }

    // On desktop: use getUserMedia for live viewfinder
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1024 }, height: { ideal: 1024 } },
        audio: false,
      });
      setStream(mediaStream);
      setMode("camera");
    } catch {
      setError(t("capture.error.noCamera"));
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Center crop and mirror for selfie
    const offsetX = (video.videoWidth - size) / 2;
    const offsetY = (video.videoHeight - size) / 2;

    ctx.save();
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, size, size);
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const base64 = dataUrl.split(",")[1] ?? "";

    stopCamera();
    setPreviewUrl(dataUrl);
    setMode("preview");
    onCapture(base64, dataUrl);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError(t("capture.error.notImage"));
      return;
    }

    try {
      const dataUrl = await compressImage(file, 1024);
      const base64 = dataUrl.split(",")[1] ?? "";
      setPreviewUrl(dataUrl);
      setMode("preview");
      onCapture(base64, dataUrl);
    } catch {
      setError(t("capture.error.processFailed"));
    }
  };

  const reset = () => {
    stopCamera();
    setPreviewUrl(null);
    setMode("select");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Hidden elements */}
      <canvas ref={canvasRef} className="hidden" />
      {/* Gallery file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      {/* Native camera capture (for mobile) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Mode: Select */}
      {mode === "select" && (
        <div className="flex flex-col gap-4">
          <div className="aspect-square rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-card)] flex flex-col items-center justify-center gap-6 p-8">
            <div className="w-32 h-44 face-guide flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-dim)" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
              </svg>
            </div>
            <p className="text-[var(--color-text-secondary)] text-center text-sm whitespace-pre-line">
              {t("capture.instruction")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={startCamera}
              disabled={disabled}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg)] font-semibold text-sm hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              {t("capture.camera")}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] font-semibold text-sm hover:border-[var(--color-gold-dim)] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              {t("capture.upload")}
            </button>
          </div>

          <p className="text-center text-xs text-[var(--color-text-secondary)] opacity-60 mt-2">
            {t("capture.privacy")}
          </p>
        </div>
      )}

      {/* Mode: Camera (desktop only — mobile uses native capture) */}
      {mode === "camera" && (
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {/* Face guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[60%] h-[75%] face-guide" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={reset}
              className="py-3.5 px-4 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold text-sm hover:border-[var(--color-red)] hover:text-[var(--color-red-light)] transition"
            >
              {t("capture.cancel")}
            </button>
            <button
              onClick={capturePhoto}
              className="py-3.5 px-4 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg)] font-semibold text-sm hover:brightness-110 transition"
            >
              {t("capture.shoot")}
            </button>
          </div>
        </div>
      )}

      {/* Mode: Preview */}
      {mode === "preview" && previewUrl && (
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-[var(--color-border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={t("capture.previewAlt")}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 right-3">
              <button
                onClick={reset}
                disabled={disabled}
                className="py-2 px-4 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-medium hover:bg-black/80 transition disabled:opacity-50"
              >
                {t("capture.retake")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-3 text-center text-sm text-[var(--color-red-light)]">
          {error}
        </p>
      )}
    </div>
  );
}
