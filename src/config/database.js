const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://futbolstats:futbolstats_secret@localhost:5432/futbolstats_pro',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        position VARCHAR(50) NOT NULL,
        team VARCHAR(100) NOT NULL,
        goals INTEGER DEFAULT 0,
        assists INTEGER DEFAULT 0,
        matches INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const result = await client.query('SELECT COUNT(*) FROM players');
    if (parseInt(result.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO players (name, position, team, goals, assists, matches)
        VALUES
          ('Lionel Messi', 'Forward', 'Inter Miami', 35, 18, 30),
          ('Cristiano Ronaldo', 'Forward', 'Al Nassr', 40, 8, 35),
          ('Kylian Mbappé', 'Forward', 'Real Madrid', 28, 12, 32),
          ('Erling Haaland', 'Forward', 'Manchester City', 32, 5, 30),
          ('Kevin De Bruyne', 'Midfielder', 'Manchester City', 10, 22, 28);
      `);
    }
  } finally {
    client.release();
  }
}

async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text: text.substring(0, 50), duration, rows: res.rowCount });
  return res;
}

module.exports = { pool, query, initDatabase };
