import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type") ?? "gwansang";
  const title = searchParams.get("title") ?? "당신의 운명을 확인하세요";
  const subtitle = searchParams.get("subtitle") ?? "";
  const nickname = searchParams.get("nickname") ?? "";

  const isGwansang = type === "gwansang";
  const accentColor = isGwansang ? "#d4a574" : "#7c3aed";
  const label = isGwansang ? "AI 관상" : "사주팔자";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0a1628 0%, #1e293b 50%, #0a1628 100%)",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            borderRadius: "100px",
            border: `1px solid ${accentColor}33`,
            color: accentColor,
            fontSize: "18px",
            marginBottom: "24px",
          }}
        >
          {label}
        </div>

        {/* Nickname */}
        {nickname && (
          <div
            style={{
              display: "flex",
              fontSize: "28px",
              color: accentColor,
              marginBottom: "16px",
            }}
          >
            &ldquo;{nickname}&rdquo;
          </div>
        )}

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: "48px",
            fontWeight: "bold",
            color: "#e2e8f0",
            textAlign: "center",
            marginBottom: "16px",
            maxWidth: "800px",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              display: "flex",
              fontSize: "22px",
              color: "#94a3b8",
              textAlign: "center",
              maxWidth: "700px",
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Brand */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "40px",
            fontSize: "20px",
            color: "#64748b",
          }}
        >
          moodang.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
