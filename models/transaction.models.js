const mongoose = require("mongoose")

const Schema = mongoose.Schema
const transactionSchema = new Schema({
  amount:{
    type: Number,
    required: [true, 'amount is required'],
  },
  processed:{
    type: Boolean,
    default: false
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true
  }
},
{
  collection: 'Transactions',
  timestamps: true
})
module.exports = mongoose.model('Transaction', transactionSchema)