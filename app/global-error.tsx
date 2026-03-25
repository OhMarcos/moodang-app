"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div style={{ maxWidth: 400, textAlign: "center" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
              오류가 발생했습니다
            </h2>
            <div
              style={{
                padding: "1rem",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "0.75rem",
                textAlign: "left",
                wordBreak: "break-all",
                fontSize: "0.875rem",
                fontFamily: "monospace",
                color: "#991b1b",
              }}
            >
              {error.message}
              {error.digest && (
                <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.5rem" }}>
                  Digest: {error.digest}
                </p>
              )}
            </div>
            <button
              onClick={reset}
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 1.5rem",
                background: "#7c3aed",
                color: "white",
                border: "none",
                borderRadius: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
