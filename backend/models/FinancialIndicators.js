// models/FinancialIndicators.js
const mongoose = require('mongoose');

const FinancialIndicatorsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  totalAssets: { type: Number, required: true },
  totalLiabilities: { type: Number, required: true },
  totalEquity: { type: Number, required: true },
  currentAssets: { type: Number, required: true },
  currentLiabilities: { type: Number, required: true },
  revenue: { type: Number, required: true },
  expenses: { type: Number, required: true },
  netIncome: { type: Number, required: true }
});

FinancialIndicatorsSchema.methods.calculateIndicators = function() {
  return {
    debtRatio: this.totalLiabilities / this.totalAssets,
    currentRatio: this.currentAssets / this.currentLiabilities,
    returnOnAssets: this.netIncome / this.totalAssets,
    profitMargin: this.netIncome / this.revenue
  };
};

module.exports = mongoose.model('FinancialIndicators', FinancialIndicatorsSchema);