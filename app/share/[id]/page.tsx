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

  const label = type === "gwansang" ? "AI Face Reading Result" : "Destiny Analysis Result";
  const labelKo = type === "gwansang" ? "AI 관상 결과" : "사주팔자 결과";
  const gradeLabel = fortuneGrade ? ` [${fortuneGrade}]` : "";
  const hanjaLabel = destinyHanja ? ` ${destinyHanja}` : "";
  const displayTitle = sp.nickname
    ? `"${sp.nickname}" — ${label}${gradeLabel}${hanjaLabel}`
    : `${label}${gradeLabel}${hanjaLabel}`;
  const displayTitleKo = sp.nickname
    ? `"${sp.nickname}" — ${labelKo}${gradeLabel}${hanjaLabel}`
    : `${labelKo}${gradeLabel}${hanjaLabel}`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://moodang.app";
  const ogUrl = `${baseUrl}/api/og/${id}?type=${type}&title=${encodeURIComponent(sp.title ?? displayTitleKo)}&nickname=${encodeURIComponent(sp.nickname ?? "")}`;

  const description = "Try AI Face Reading & Destiny Analysis — moodang.app";

  return {
    title: `${displayTitle} | MOODANG`,
    description,
    openGraph: {
      title: displayTitle,
      description,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
      type: "website",
      locale: "en_US",
      alternateLocale: "ko_KR",
      siteName: "MOODANG",
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description,
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
