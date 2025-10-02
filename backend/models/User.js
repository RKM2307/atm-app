const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true }
});

const userSchema = new mongoose.Schema({
  pin: { type: Number, required: true },
  balance: { type: Number, default: 0 },
  transactions: { type: [transactionSchema], default: [] }
});

module.exports = mongoose.model('User', userSchema);
