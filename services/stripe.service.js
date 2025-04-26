const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const QUANTITY = 1; // just number not string

const createCheckoutSession = async (price_id) => {
  const BACKEND_URL = process.env.YOUR_DOMAIN || 'http://localhost:3000';
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: price_id,
        quantity: QUANTITY,
      },
    ],
    mode: 'payment',
    success_url: `${BACKEND_URL}/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BACKEND_URL}/cancel?canceled=true`,
  });
};

const retrieveSession = async (sessionId) => {
  return await stripe.checkout.sessions.retrieve(sessionId);
};

module.exports = {
  createCheckoutSession,
  retrieveSession
};
