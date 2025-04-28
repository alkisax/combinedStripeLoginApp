const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const QUANTITY = 1; // just number not string

const createCheckoutSession = async (price_id) => {
  const BACKEND_URL = process.env.YOUR_DOMAIN || 'http://localhost:3000';
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://http://localhost:5173'
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: price_id,
        quantity: QUANTITY,
      },
    ],
    mode: 'payment',
    // added to get the participant info from front to be able to create a new transaction
    // success_url: `${BACKEND_URL}/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
    success_url: `${BACKEND_URL}/success?success=true&session_id={CHECKOUT_SESSION_ID}&name=${participantInfo.name}&surname=${participantInfo.surname}&email=${participantInfo.email}`,
    cancel_url: `${FRONTEND_URL}/cancel?canceled=true`,
    // added to get the participant info from front to be able to create a new transaction
    metadata: {
      name: participantInfo.name,
      surname: participantInfo.surname,
      email: participantInfo.email
    }
  });
};

const retrieveSession = async (sessionId) => {
  return await stripe.checkout.sessions.retrieve(sessionId);
};

module.exports = {
  createCheckoutSession,
  retrieveSession
};
