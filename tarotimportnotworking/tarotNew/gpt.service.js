// gpt.service.js

const axios = require('axios');

const getGPTResponse = (userQuestion, selectedCards, apiKey, bias, lang) => {
  const tarot_prompt = lang === 'en' 
    ? "You are a Tarot interpreter. Provide a detailed interpretation of the following Tarot cards in direct response to the question asked."
    : "Είσαι ερμηνευτής Ταρώ. Παρέχετε μια λεπτομερή ερμηνεία των παρακάτω καρτών Ταρώ σε άμεση απάντηση στην ερώτηση που τέθηκε.";

  const fullPrompt = `${tarot_prompt} 
  Question: ${userQuestion} 
  Drawn Cards: ${selectedCards.join(', ')} 
  Bias: ${bias || 'None'}`;

  const url = 'https://api.openai.com/v1/chat/completions';

  return axios.post(url, {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: fullPrompt }],
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.data.choices[0].message.content)
    .catch(error => {
      throw new Error(`Error fetching GPT response: ${error.message}`);
    });
};

module.exports = { getGPTResponse };
