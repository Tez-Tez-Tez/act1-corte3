require('dotenv').config();
const app = require('./app');
const { initDatabase } = require('./config/database');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await initDatabase();
    console.log('Database initialized');
  } catch (err) {
    console.error('Database initialization failed:', err.message);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FutbolStats Pro running on port ${PORT}`);
  });
}

start();

module.exports = app;
