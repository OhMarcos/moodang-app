export const PRICES = {
  gwansang: {
    amount: 3900,
    currency: "krw",
    label: "AI 관상 분석",
    stripePriceId: process.env.STRIPE_GWANSANG_PRICE_ID ?? "",
  },
  saju: {
    amount: 9900,
    currency: "krw",
    label: "사주팔자 분석",
    stripePriceId: process.env.STRIPE_SAJU_PRICE_ID ?? "",
  },
} as const;

export type ServiceType = keyof typeof PRICES;
