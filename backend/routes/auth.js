const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registrace uživatele
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Kontrola, zda uživatel již existuje
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Uživatel již existuje' });
    }

    // Vytvoření nového uživatele
    user = new User({ name, email, password });

    // Hashování hesla
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Uložení uživatele do databáze
    await user.save();

    // Vytvoření JWT tokenu
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 }, // Token vyprší za 1 hodinu
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Přihlášení uživatele
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kontrola, zda uživatel existuje
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Neplatné přihlašovací údaje' });
    }

    // Kontrola hesla
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Neplatné přihlašovací údaje' });
    }

    // Vytvoření JWT tokenu
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;