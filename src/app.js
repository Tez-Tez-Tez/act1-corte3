const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./config/database');
const healthRouter = require('./routes/health');
const playersRouter = require('./routes/players');
const errorHandler = require('./middleware/errorHandler');

const app = express();

initDatabase().catch(err => {
  const msg = err.errors ? err.errors.map(e => e.message).join(', ') : err.message;
  console.error('DB init failed:', msg);
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'FutbolStats Pro API', version: '1.0.0' });
});

app.use('/api/health', healthRouter);
app.use('/api/players', playersRouter);

app.use(errorHandler);

module.exports = app;
