const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true },
  recipientAccount: { type: String, required: true },
  swiftCode: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // Default status
  paymentMethod: { type: String, default: 'Bank Transfer' }, // Add if needed
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;