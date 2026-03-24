import Link from "next/link";
import type { Metadata } from "next";
import { getReading } from "@/lib/database";

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
  const nickname = sp.nickname;
  const isGwansang = type === "gwansang";

  const accentClass = isGwansang
    ? "bg-[var(--color-sacred-gold)]"
    : "bg-[var(--color-mystic-purple)]";
  const badgeClass = isGwansang
    ? "bg-[var(--color-sacred-gold)]/10 border border-[var(--color-sacred-gold)]/20 text-[var(--color-sacred-gold)]"
    : "bg-[var(--color-mystic-purple)]/10 border border-[var(--color-mystic-purple)]/20 text-[var(--color-mystic-purple-light)]";
  const gradientClass = isGwansang ? "text-gold-gradient" : "text-purple-gradient";

  const features = isGwansang
    ? ["색기 / 총기 / 재력 / 인복 / 관종력 점수", "Pokemon 카드 스타일 분석", "불편한 진실 + 전생 직업"]
    : ["운명 유형 + SSS~C 등급", "재물 / 연애 / 직업 / 건강 / 명예 점수", "유명인 매칭 + 올해 운세"];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${badgeClass}`}>
          {isGwansang ? "AI 관상" : "사주팔자"}
        </div>

        {/* Nickname */}
        {nickname && (
          <p className={`text-2xl font-bold font-[family-name:var(--font-serif)] ${gradientClass}`}>
            &ldquo;{nickname}&rdquo;
          </p>
        )}

        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
          친구가 {isGwansang ? "관상" : "사주"} 분석을 공유했어요
        </h1>

        {/* DB-backed reading preview (teaser) */}
        {reading && !isGwansang && (
          <div className="rounded-2xl border border-[var(--color-border)] p-4 space-y-3 text-left">
            {reading.fortune_grade && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-[var(--color-mystic-purple-light)]">
                  {reading.fortune_grade}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">등급</span>
                {reading.destiny_type_hanja && (
                  <span className="ml-auto text-3xl font-serif text-[var(--color-sacred-gold)]">
                    {reading.destiny_type_hanja}
                  </span>
                )}
              </div>
            )}
            {reading.celebrity_match && (
              <p className="text-xs text-[var(--color-text-secondary)]">
                유명인 매칭: <span className="font-semibold">{reading.celebrity_match}</span>
              </p>
            )}
            <p className="text-xs text-[var(--color-text-muted)] italic">
              전체 결과를 보려면 나도 분석해보세요
            </p>
          </div>
        )}

        <p className="text-sm text-[var(--color-text-secondary)]">
          나도 {isGwansang ? "얼굴 사진으로 관상" : "생년월일로 사주"}을 분석해보세요
        </p>

        {/* Feature highlights */}
        <div className="text-left space-y-2 py-2">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${accentClass}`} />
              {f}
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/${type}`}
          className={`inline-block w-full py-4 rounded-xl font-bold text-base text-white transition hover:brightness-110 ${accentClass}`}
        >
          나도 해보기
        </Link>

        {/* Social proof */}
        <p className="text-xs text-[var(--color-text-muted)]">
          전통 동양학 기반 AI 분석 서비스
        </p>

        <Link
          href="/"
          className="block text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition"
        >
          무당 MOODANG 홈으로
        </Link>
      </div>
    </div>
  );
}
