const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Invoice = require('../models/Invoice');
const Loan = require('../models/Loan');
const FinancialIndicators = require('../models/FinancialIndicators');

// Get financial summary
router.get('/summary', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id });
    const loans = await Loan.find({ user: req.user.id });
    
    const totalIncome = invoices.filter(i => i.type === 'vydana').reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = invoices.filter(i => i.type === 'prijata').reduce((sum, i) => sum + i.amount, 0);
    const totalLoans = loans.reduce((sum, l) => sum + l.remainingAmount, 0);

    res.json({
      totalIncome,
      totalExpenses,
      totalLoans,
      netIncome: totalIncome - totalExpenses
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add new invoice
router.post('/invoice', auth, async (req, res) => {
  try {
    const newInvoice = new Invoice({
      user: req.user.id,
      ...req.body
    });

    const invoice = await newInvoice.save();
    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all invoices
router.get('/invoices', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id }).sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add new loan
router.post('/loan', auth, async (req, res) => {
  try {
    const newLoan = new Loan({
      user: req.user.id,
      ...req.body
    });

    const loan = await newLoan.save();
    res.json(loan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all loans
router.get('/loans', auth, async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id }).sort({ startDate: -1 });
    res.json(loans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update financial indicators
router.post('/indicators', auth, async (req, res) => {
  try {
    let indicators = await FinancialIndicators.findOne({ user: req.user.id });
    if (indicators) {
      indicators = await FinancialIndicators.findOneAndUpdate(
        { user: req.user.id },
        { $set: req.body },
        { new: true }
      );
    } else {
      indicators = new FinancialIndicators({
        user: req.user.id,
        ...req.body
      });
      await indicators.save();
    }
    res.json(indicators);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get financial indicators
router.get('/indicators', auth, async (req, res) => {
  try {
    const indicators = await FinancialIndicators.findOne({ user: req.user.id });
    if (!indicators) {
      return res.status(404).json({ msg: 'Finanční ukazatele nenalezeny' });
    }
    res.json(indicators);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;