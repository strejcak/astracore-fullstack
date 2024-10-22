const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Připojení k databázi
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Připojeno k MongoDB'))
  .catch(err => console.error('Chyba při připojení k MongoDB:', err));

// Základní route
app.get('/', (req, res) => {
  res.send('AstraCore API běží');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/finance', require('./routes/finance'));

// Ošetření neexistujících routes
app.use((req, res) => {
  res.status(404).send('404 - Stránka nenalezena');
});

// Globální ošetření chyb
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('500 - Chyba serveru');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));