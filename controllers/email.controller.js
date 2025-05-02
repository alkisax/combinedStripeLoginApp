const nodemailer = require("nodemailer");
const transactionDAO = require('../daos/transaction.dao')

exports.sendThnxEmail = async (req,res) => {
  try {

    const transactionId = req.params.transactionId
    console.log(('transactionId from email.controller', transactionId));    
    const transaction = await transactionDAO.findTransactionById(transactionId)
    const email = transaction.participant.email
    const name = transaction.participant.name

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Your Donation",
      text: `Dear ${name},\n\nThank you for your generous donation! We greatly appreciate your support.\n\nBest regards,\nThe Team`,
    };

    const emailRecipt = await transporter.sendMail(mailOptions);
    res.status(200).json({ status: true, data: emailRecipt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: 'Thnx email Internal server error' });
  }
}