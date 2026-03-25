import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="text-center pt-16 pb-12 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-mystic-purple)]/10 border border-[var(--color-mystic-purple)]/20 text-xs text-[var(--color-mystic-purple-light)] mb-6">
          AI &times; 전통 동양학
        </div>

        <h1 className="font-[family-name:var(--font-serif)] text-4xl sm:text-5xl font-bold mb-4">
          <span className="text-gold-gradient">무당</span>
          <span className="text-[var(--color-text-primary)]"> MOODANG</span>
        </h1>

        <p className="text-lg text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed mb-2">
          당신의 얼굴과 사주가 말하는 것
        </p>
        <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto">
          전통 관상학과 사주팔자의 수백 년 지혜를 AI로 경험하세요
        </p>
      </section>

      {/* Service Cards */}
      <section className="max-w-lg mx-auto px-4 space-y-4">
        {/* Gwansang Card */}
        <Link href="/gwansang" className="block group">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 transition-all hover:border-[var(--color-sacred-gold)]/40 hover:shadow-[0_0_24px_rgba(212,165,116,0.1)]">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-[var(--color-sacred-gold)]/10 flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-[var(--color-sacred-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)]">AI 관상</h2>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  얼굴 사진 한 장으로 12궁, 삼정, 오관 전통 관상학 분석. 성격, 재물운, 애정운, 직업운까지.
                </p>
              </div>
              <svg className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-sacred-gold)] transition shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Saju Card */}
        <Link href="/saju" className="block group">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 transition-all hover:border-[var(--color-mystic-purple)]/40 hover:shadow-[0_0_32px_rgba(124,58,237,0.1)]">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-[var(--color-mystic-purple)]/10 flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-[var(--color-mystic-purple-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)]">운명교차점</h2>
                  <span className="text-[10px] text-[var(--color-mystic-purple-light)] bg-[var(--color-mystic-purple)]/10 px-1.5 py-0.5 rounded-full font-medium">3-System</span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  동서양 3대 운명학 교차분석. 사주·Vedic·주역이 한 목소리로 말하는 연애·재물·직업 에너지 리포트.
                </p>
              </div>
              <svg className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-mystic-purple-light)] transition shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </Link>
      </section>

      {/* How it works */}
      <section className="max-w-lg mx-auto px-4 mt-16">
        <h2 className="font-[family-name:var(--font-serif)] text-center text-sm font-bold text-[var(--color-text-muted)] mb-8 tracking-wider uppercase">
          이용 방법
        </h2>
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { step: "1", title: "선택", desc: "관상 또는\n운명분석 선택" },
            { step: "2", title: "입력", desc: "사진 촬영 또는\n생년월일시 입력" },
            { step: "3", title: "결과", desc: "AI 분석 리포트\n확인 & 공유" },
          ].map((item) => (
            <div key={item.step} className="space-y-3">
              <div className="w-10 h-10 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] flex items-center justify-center mx-auto">
                <span className="text-sm font-bold text-[var(--color-text-secondary)]">{item.step}</span>
              </div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</p>
              <p className="text-xs text-[var(--color-text-muted)] whitespace-pre-line">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="text-center mt-16 mb-8 px-4">
        <p className="text-xs text-[var(--color-text-muted)]">
          전통 동양학 기반 AI 분석 서비스
        </p>
      </section>
    </div>
  );
}
