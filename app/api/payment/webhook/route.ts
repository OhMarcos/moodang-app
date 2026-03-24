import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/payment/stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  try {
    const event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { type, readingId } = session.metadata ?? {};

        console.log(`Payment completed: type=${type}, readingId=${readingId}`);
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Webhook error:", errMsg);
    return NextResponse.json(
      { error: `Webhook error: ${errMsg}` },
      { status: 400 }
    );
  }
}
