const express = require('express');
const { query } = require('../config/database');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM players ORDER BY goals DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM players WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, position, team, goals, assists, matches } = req.body;
    const result = await query(
      `INSERT INTO players (name, position, team, goals, assists, matches)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, position, team, goals || 0, assists || 0, matches || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM players WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json({ message: 'Player deleted', player: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
