import Stripe from "stripe";

// Lazy init — only fails at runtime when actually called, not at build time
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(secretKey, {
      apiVersion: "2025-08-27.basil",
    });
  }
  return _stripe;
}
