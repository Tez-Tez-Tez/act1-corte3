const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./config/database');
const healthRouter = require('./routes/health');
const playersRouter = require('./routes/players');
const errorHandler = require('./middleware/errorHandler');

const app = express();

initDatabase().catch(err => console.error('DB init failed:', err.message));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'FutbolStats Pro API', version: '1.0.0' });
});

app.use('/api/health', healthRouter);
app.use('/api/players', playersRouter);

app.use(errorHandler);

module.exports = app;
