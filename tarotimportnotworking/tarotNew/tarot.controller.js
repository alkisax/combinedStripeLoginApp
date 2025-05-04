// tarot.controller.js

const { getTarotReading } = require('./tarot.service');
const { getGPTResponse } = require('./gpt.service');
const Query = require('./query.model');

const getTarotReadingController = async (req, res) => {
  const { userQuestion = "What do I need to know today?", bias, lang = 'en' } = req.query;

  try {
    const { drawnCards, selectedCards } = getTarotReading(userQuestion, process.env.OPENAI_API_KEY, bias, lang);
    
    const gptResponse = await getGPTResponse(userQuestion, selectedCards, process.env.OPENAI_API_KEY, bias, lang);

    const query = new Query({
      message: userQuestion,
      bias: bias
    });

    await query.save();

    res.json({
      drawnCards,
      selectedCards,
      gptResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTarotReadingController };
