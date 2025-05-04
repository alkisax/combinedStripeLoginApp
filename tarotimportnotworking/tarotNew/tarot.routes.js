// tarot.routes.js

const express = require('express');
const { getTarotReadingController } = require('./tarot.controller');

const router = express.Router();

router.get('/tarot-reading', getTarotReadingController);

module.exports = router;
