const stripeService = require('../services/stripe.service');
const transactionDAO = require('../daos/transaction.dao');
const participantDAO = require('../daos/participant.dao');

const createCheckoutSession = async (req, res) => {
  const price_id = req.params.price_id;

  try {
    const session = await stripeService.createCheckoutSession(price_id);
    res.json(session);
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const handleSuccess = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId) {
      return res.status(400).send('Missing session ID.');
    }

    const session = await stripeService.retrieveSession(sessionId);

    const amountTotal = session.amount_total / 100; // Stripe returns cents
    const customerEmail = session.customer_details.email;

    console.log(`Payment success for: ${customerEmail}, amount: ${amountTotal}`);

    let participant = await participantDAO.findParticipantByEmail(customerEmail);

    if (!participant) {
      console.log('Participant not found, creating new one...');
      await participantDAO.createParticipant({ email: customerEmail, name: 'Anonymous', surname: 'Donator' });
    }

    participant = await participantDAO.findParticipantByEmail(customerEmail);

    await transactionDAO.createTransaction({
      amount: amountTotal,
      processed: true,
      participant: participant._id
    });

    return res.send('Success! Your donation was recorded. Thank you!');
  } catch (error) {
    console.error('Error processing success route:', error.message);
    return res.status(500).send('Something went wrong.');
  }
};

const handleCancel = (req, res) => {
  return res.send('Payment canceled! :(');
};

module.exports = {
  createCheckoutSession,
  handleSuccess,
  handleCancel
};