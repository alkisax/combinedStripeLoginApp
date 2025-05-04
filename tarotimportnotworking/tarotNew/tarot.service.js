// tarot.service.js

const { tarotDeck, draw } = require('./tarotLogic/tarotCards');

const getTarotReading = (userQuestion, apiKey, bias, lang) => {
  const drawnCards = draw();

  const selectedCards = [
    tarotDeck[drawnCards.first],
    tarotDeck[drawnCards.second],
    tarotDeck[drawnCards.third]
  ];

  return {
    drawnCards,
    selectedCards
  };
};

module.exports = { getTarotReading };
