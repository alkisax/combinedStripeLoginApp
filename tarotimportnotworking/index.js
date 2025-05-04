require('dotenv').config();
const mongoose = require('mongoose')
const cors = require("cors");
const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(express.json());
app.use(cors()); // Allow all origins
app.use(morgan('dev'));
app.use(express.static('dist')) // to create static render for dist, on the server

// MongoDb start here
const mongoURI = process.env.MONGODB_URI;
mongoose.set('strictQuery',false)
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
const querySchema = new mongoose.Schema({
  message: String,
  bias: String,
})
const Query = mongoose.model('Query', querySchema)
//

const { getTarotReading } = require('./GPTLogic');

const apiKey = process.env.OPENAI_API_KEY;
console.log("Starting");

app.get('/api/test-mongoDB/', (req, res) => {
  Query.find({})
    .then(questions => {
      res.json(questions)
    })
})

// app.get('/deck', (req, res) => {

// })

app.get('/test-openai', (req, res) => {
  const userQuestion = req.query.userQuestion || "What do I need to know today?"; // Default question if not provided
  const bias = req.query.bias;
  const lang = req.query.lang;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }

  getTarotReading(userQuestion, apiKey, bias)
    .then(result => {
      res.json({
        drawnCards: result.drawnCards,
        selectedCards: result.selectedCards,
        gptResponse: result.gptResponse,
      });      
      //mongoDB
      const query = new Query({
        message: userQuestion,
        bias: bias
      })

      query.save().then(result => {
        mongoose.connection.close()
      })
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: error.message });
    });
});

// Catch-all route for unknown endpoints (404)
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
// Error handling middleware (MUST be the last middleware)
const errorHandler = (error, request, response, next) => {
  console.error(error.message); // Log error message
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' });
  }
  // If error is not a CastError, pass it to the default Express error handler
  next(error);
};
// Add unknown endpoint middleware before the error handler
app.use(unknownEndpoint);
// Add the error handler as the last middleware
app.use(errorHandler);


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
