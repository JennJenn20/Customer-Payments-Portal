const Payment = require('../models/Payment');

const validateInput = (input, pattern) => {
  return pattern.test(input);
};

exports.processPayment = async (req, res) => {
  const { amount, currency, recipientAccount, swiftCode } = req.body;

  const amountPattern = /^[0-9]+(\.[0-9]{1,2})?$/;
  const currencyPattern = /^[A-Z]{3}$/;
  const accountPattern = /^[0-9]{10}$/;
  const swiftPattern = /^[A-Z0-9]{8,11}$/;

  if (!validateInput(amount, amountPattern) ||
      !validateInput(currency, currencyPattern) ||
      !validateInput(recipientAccount, accountPattern) ||
      !validateInput(swiftCode, swiftPattern)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const payment = new Payment({ amount, currency, recipientAccount, swiftCode });
    await payment.save();

    res.status(201).json({ message: 'Payment processed successfully' });
  } catch (err) {
    console.error('Error processing payment:', err);
    res.status(500).json({ message: 'Server error' });
  }
};