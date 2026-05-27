const { initDatabase } = require('../src/config/database');

module.exports = async () => {
  const maxRetries = 10;
  for (let i = 0; i < maxRetries; i++) {
    try {
      await initDatabase();
      console.log('Test database initialized');
      return;
    } catch (err) {
      const msg = err.errors ? err.errors.map(e => e.message).join(', ') : err.message;
      console.error(`DB setup attempt ${i + 1}/${maxRetries} failed:`, msg);
      if (i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }
  throw new Error('Failed to initialize database after retries');
};
