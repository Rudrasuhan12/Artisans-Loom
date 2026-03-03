import Stripe from "stripe";

const globalForStripe = global as unknown as { stripe: Stripe };

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    typescript: true,
  });
}

export const stripe = globalForStripe.stripe || getStripe();

if (process.env.NODE_ENV !== "production") {
  globalForStripe.stripe = stripe;
}
