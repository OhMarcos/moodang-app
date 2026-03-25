# moodang.app

사주/관상/운세 종합 분석 앱

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: Supabase (Postgres)
- **Deploy**: Vercel
- **AI**: Google Gemini (관상 분석), Claude (사주 분석)
- **Payment**: Stripe
- **Analytics**: PostHog

## Key Features

- 사주 분석 (생년월일시 기반)
- 관상 분석 (카메라 캡처 → AI 분석)
- 결과 공유 (OG image, share link)
- 결제 시스템 (Stripe)

## Knowledge Base

- `knowledge-base/` — 사주, 주역, 베딕 분석 매뉴얼 (3-System: Triple Lens)

## Important Paths

- `app/saju/` — 사주 분석 페이지
- `app/gwansang/` — 관상 분석 페이지
- `lib/saju/` — 사주 엔진 (3개 계산기: 사주·Vedic·주역)
- `lib/gwansang/` — 관상 분석 로직
- `lib/database/` — Supabase DB 레이어
