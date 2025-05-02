const bcrypt = require('bcrypt')
const Transaction = require('../models/transaction.models')
const transactionDAO = require('../daos/transaction.dao')
const participantDAO = require('../daos/participant.dao')
const axios = require('axios')
// const sendThnxEmail = require('../controllers/email.controller') // !!!

BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'

exports.findAll = async (req,res) => {
  try {

    // add later when auth
    if (!req.headers.authorization) {
      return res.status(401).json({ status: false, error: 'No token provided' });
    }

    const transactions = await transactionDAO.findAllTransactions();
    res.status(200).json({ status: true, data: transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: 'Internal server error' });
  }
}

exports.findUnprocessed = async (req,res) => {
  
  try {
    // add later when auth
    if (!req.headers.authorization) {
      return res.status(401).json({ status: false, error: 'No token provided' });
    }

    const unprocessed = await transactionDAO.findTransactionsByProcessed(false)
    res.status(200).json({
      status: true,
      data: unprocessed
    })

  } catch (error) {
    res.status(500).json(error)
  }
}

exports.create = async (req,res) => {
  let data = req.body
  const amount = data.amount
  const processed = data.processed
  const participant = data.participant

  try {
    const newTransaction = await transactionDAO.createTransaction({
      amount,
      processed,
      participant
    });

    console.log(`Created new transaction: ${amount}`);

    await participantDAO.addTransactionToParticipant(participant, newTransaction._id);

    res.status(201).json(newTransaction)
  } catch(error) {
    console.log(`Error creating transaction: ${error.message}`);
    res.status(400).json({error: error.message})
  }
}

exports.toggleProcessed = async (req,res) => {
  const transactionId = req.params.id
  if (!transactionId){
    return res.status(400).json({
      status: false,
      error: 'transaction ID is required OR not found'
    })
  }

  try {
    const transaction = await transactionDAO.findTransactionById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        status: false,
        error: 'Transaction not found',
      });
    }

    const updatedData = {
      processed: !transaction.processed
    }

    const updatedTransaction = await transactionDAO.updateTransactionById(transactionId, updatedData)

    await axios.post(`${BACKEND_URL}/api/email/${transactionId}`)
    res.status(200).json({ status: true, data: updatedTransaction})
  } catch (error) {
    res.status(500).json({
      status:false,
      error: error.message
    })
  }
}

exports.deleteById = async (req, res) => {
  const transactionId = req.params.id
  if (!transactionId){
    return res.status(400).json({
      status: false,
      error: 'transaction ID is required OR not found'
    })
  }
  
  try {
    const deleteTransaction = await transactionDAO.deleteTransactionById(transactionId) 

    if (!deleteTransaction){
      return res.status(404).json({
        status: false,
        error: 'Error deleting transaction: not found'
      })
    } else {
      res.status(200).json({
        status: true,
        message: `transaction deleted successfully`,
      })
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    })
  }
}