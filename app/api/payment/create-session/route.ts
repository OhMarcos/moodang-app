import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/payment/stripe";
import { PRICES, type ServiceType } from "@/lib/payment/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, readingId } = body as { type: ServiceType; readingId?: string };

    if (!type || !(type in PRICES)) {
      return NextResponse.json(
        { error: "유효하지 않은 서비스 타입입니다." },
        { status: 400 }
      );
    }

    const price = PRICES[type];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: price.currency,
            product_data: {
              name: price.label,
              description: `무당 MOODANG - ${price.label}`,
            },
            unit_amount: price.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type,
        readingId: readingId ?? "",
      },
      success_url: `${baseUrl}/${type}?paid=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${type}`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Payment session error:", errMsg);
    return NextResponse.json(
      { error: "결제 세션 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
