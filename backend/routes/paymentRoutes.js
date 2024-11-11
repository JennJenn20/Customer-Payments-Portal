const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment'); // Assuming you have a Payment model

// Payment endpoint
router.post('/', async (req, res) => {
  const { amount, currency, recipientAccount, swiftCode } = req.body;

  // Validate inputs
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }
  if (!currency) {
    return res.status(400).json({ message: 'Currency is required' });
  }
  if (!recipientAccount) {
    return res.status(400).json({ message: 'Recipient account is required' });
  }
  if (!swiftCode) {
    return res.status(400).json({ message: 'SWIFT code is required' });
  }

  // Create a new payment record
  const payment = new Payment({
    amount,
    currency,
    recipientAccount,
    swiftCode,
  });

  try {
    await payment.save();
    res.status(201).json({ message: 'Payment processed successfully!' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;