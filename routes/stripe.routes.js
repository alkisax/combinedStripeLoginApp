const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripe.controller');

router.post('/checkout/:price_id', stripeController.createCheckoutSession);
router.get('/success', stripeController.handleSuccess);
router.get('/cancel', stripeController.handleCancel);

module.exports = router;