const axios = require('axios');
const { tarotDeck, draw } = require('./tarotLogic/tarotCards');

const getTarotReading = (userQuestion, apiKey, bias, lang) => {

  // Draw three unique tarot cards
  const drawnCards = draw();

  console.log(`
    draw:
    first: ${tarotDeck[drawnCards.first]}
    second: ${tarotDeck[drawnCards.second]}
    third: ${tarotDeck[drawnCards.third]}
    `);

  // Format the selected cards
  const selectedCards = [
      tarotDeck[drawnCards.first],
      tarotDeck[drawnCards.second],
      tarotDeck[drawnCards.third]
  ];

  const tarot_prompt = lang === 'en' 
  ? "You are a Tarot interpreter. Provide a detailed interpretation of the following Tarot cards in direct response to the question asked. For each card, describe its meaning thoroughly and explain its relevance to the question. After interpreting each card individually, provide a combined interpretation that synthesizes the meanings of all the cards in relation to the question asked. Avoid any introductory or contextual information, and focus solely on delivering a profound and insightful analysis of the individual cards and their combined significance. Do not refer to yourself or anything outside of the Tarot cards and their meanings." 
  : "Είσαι ερμηνευτής Ταρώ. Παρέχετε μια λεπτομερή ερμηνεία των παρακάτω καρτών Ταρώ σε άμεση απάντηση στην ερώτηση που τέθηκε. Για κάθε κάρτα, περιγράψτε λεπτομερώς τη σημασία της και εξηγήστε τη συνάφειά της με την ερώτηση. Μετά την ερμηνεία κάθε κάρτας ξεχωριστά, παρέχετε μια συνδυασμένη ερμηνεία που συνθέτει τις έννοιες όλων των καρτών σε σχέση με την ερώτηση που τέθηκε. Αποφύγετε οποιαδήποτε εισαγωγική ή συμφραζόμενη πληροφορία και εστιάστε αποκλειστικά στην παροχή μιας βαθιάς και διορατικής ανάλυσης των μεμονωμένων καρτών και της συνδυασμένης τους σημασίας. Μην αναφέρεστε στον εαυτό σας ή σε οτιδήποτε εκτός από τις κάρτες Ταρώ και τις έννοιές τους.";

  // Construct the full message for GPT-4
  const fullPrompt = `${tarot_prompt} 
  Question: ${userQuestion} 
  Drawn Cards: ${selectedCards.join(', ')} 
  Bias: ${bias || 'None'}`;

  console.log("fullPrompt: ", fullPrompt);
  

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
    .then(response => {
      const message = response.data.choices[0].message.content;
      return {
        drawnCards,
        selectedCards,
        gptResponse: message,
      };
    })
    .catch(error => {
      throw new Error(`Error fetching GPT-4 response: ${error.message}`);
    });
};

module.exports = { getTarotReading };