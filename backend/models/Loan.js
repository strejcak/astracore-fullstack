// models/Loan.js
const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lender: { type: String, required: true },
  originalAmount: { type: Number, required: true },
  remainingAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  monthlyPayment: { type: Number, required: true },
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  purpose: { type: String },
  paymentHistory: [{
    date: Date,
    amount: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Loan', LoanSchema);