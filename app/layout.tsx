import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import PostHogProvider from "@/components/PostHogProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "무당 MOODANG — AI 관상 & 사주 분석",
  description:
    "전통 관상학과 사주팔자의 지혜를 AI로 만나보세요. 얼굴 사진으로 관상을, 생년월일로 사주를 분석합니다.",
  keywords: [
    "관상",
    "사주",
    "AI관상",
    "사주팔자",
    "운세",
    "얼굴분석",
    "무당",
    "moodang",
  ],
  openGraph: {
    title: "무당 MOODANG — AI 관상 & 사주 분석",
    description: "당신의 얼굴과 사주가 말하는 것",
    type: "website",
    locale: "ko_KR",
    siteName: "MOODANG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FGYNZ3QQJN"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FGYNZ3QQJN');
          `}
        </Script>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <Suspense fallback={null}>
          <PostHogProvider>
            <main className="relative">{children}</main>

            <footer className="text-center py-8 px-4 mt-8 border-t border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-muted)]">
                본 서비스는 전통 관상학과 사주명리학을 기반으로 한 재미용
                콘텐츠입니다.
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 opacity-60">
                MOODANG
              </p>
            </footer>
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
