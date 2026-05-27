const { initDatabase } = require('../src/config/database');

module.exports = async () => {
  try {
    await initDatabase();
    console.log('Test database initialized');
  } catch (err) {
    console.error('Test database setup failed:', err.message);
  }
};
