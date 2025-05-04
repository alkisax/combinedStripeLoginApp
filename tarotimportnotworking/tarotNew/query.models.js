// query.model.js

const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  message: String,
  bias: String,
});

const Query = mongoose.model('Query', querySchema);

module.exports = Query;
