import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import PostHogProvider from "@/components/PostHogProvider";
import { I18nProvider } from "@/lib/i18n/context";
import DynamicMetadata from "@/components/DynamicMetadata";
import LanguageToggle from "@/components/LanguageToggle";
import LayoutFooter from "@/components/LayoutFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "MOODANG — AI Face Reading & Destiny Analysis | AI 관상 & 사주 분석",
  description:
    "Experience centuries of physiognomy and Saju wisdom through AI. 전통 관상학과 사주팔자의 지혜를 AI로 만나보세요.",
  keywords: [
    "관상",
    "사주",
    "AI관상",
    "사주팔자",
    "운세",
    "얼굴분석",
    "무당",
    "moodang",
    "face reading",
    "AI physiognomy",
    "destiny analysis",
    "fortune telling",
  ],
  openGraph: {
    title: "MOODANG — AI Face Reading & Destiny Analysis",
    description:
      "What your face and birth chart reveal | 당신의 얼굴과 사주가 말하는 것",
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
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
            <I18nProvider>
              <DynamicMetadata />
              <LanguageToggle />
              <main className="relative">{children}</main>
              <LayoutFooter />
            </I18nProvider>
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
