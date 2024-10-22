// models/Invoice.js
const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceNumber: { type: String, required: true },
  type: { type: String, enum: ['prijata', 'vydana'], required: true },
  amount: { type: Number, required: true },
  vatRate: { type: Number, default: 21 },
  dueDate: { type: Date, required: true },
  issueDate: { type: Date, required: true },
  status: { type: String, enum: ['zaplaceno', 'nezaplaceno', 'castecne_zaplaceno'], default: 'nezaplaceno' },
  counterparty: { type: String, required: true },
  description: { type: String },
  paidAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);