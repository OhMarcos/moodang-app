import type { Metadata } from "next";
import { getReading } from "@/lib/database";
import SharePageContent from "@/components/share/SharePageContent";

interface SharePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; title?: string; nickname?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: SharePageProps): Promise<Metadata> {
  const { id } = await params;
  const sp = await searchParams;

  // Try to fetch reading from DB for richer metadata
  const reading = await getReading(id);
  const type = reading?.reading_type ?? sp.type ?? "gwansang";
  const nickname = reading
    ? (reading.ai_result as Record<string, unknown>)?.destinyType
      ? undefined
      : sp.nickname
    : sp.nickname;

  const fortuneGrade = reading?.fortune_grade;
  const destinyHanja = reading?.destiny_type_hanja;

  const label = type === "gwansang" ? "AI 관상 결과" : "사주팔자 결과";
  const gradeLabel = fortuneGrade ? ` [${fortuneGrade}등급]` : "";
  const hanjaLabel = destinyHanja ? ` ${destinyHanja}` : "";
  const displayTitle = sp.nickname
    ? `"${sp.nickname}" — ${label}${gradeLabel}${hanjaLabel}`
    : `${label}${gradeLabel}${hanjaLabel}`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://moodang.app";
  const ogUrl = `${baseUrl}/api/og/${id}?type=${type}&title=${encodeURIComponent(sp.title ?? displayTitle)}&nickname=${encodeURIComponent(sp.nickname ?? "")}`;

  return {
    title: `${displayTitle} | 무당 MOODANG`,
    description: "나도 관상/사주 분석 받아보기 — moodang.app",
    openGraph: {
      title: displayTitle,
      description: "나도 관상/사주 분석 받아보기",
      images: [{ url: ogUrl, width: 1200, height: 630 }],
      type: "website",
      locale: "ko_KR",
      siteName: "MOODANG",
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description: "나도 관상/사주 분석 받아보기",
      images: [ogUrl],
    },
  };
}

export default async function SharePage({ params, searchParams }: SharePageProps) {
  const { id } = await params;
  const sp = await searchParams;

  // Try to fetch reading from DB
  const reading = await getReading(id);
  const type = reading?.reading_type ?? sp.type ?? "gwansang";

  return (
    <SharePageContent
      type={type}
      nickname={sp.nickname}
      reading={reading ? {
        fortune_grade: reading.fortune_grade,
        destiny_type_hanja: reading.destiny_type_hanja,
        celebrity_match: reading.celebrity_match,
      } : null}
    />
  );
}
