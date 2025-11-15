const express = require('express');
const router = express.Router();
const pool = require('../db');

// list canteens
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM canteens ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// add canteen
router.post('/', async (req, res) => {
  const { name, location } = req.body;
  if (!name) return res.status(400).json({ error: 'Missing name' });
  try {
    const [r] = await pool.query('INSERT INTO canteens (name,location) VALUES (?,?)', [name, location || null]);
    res.json({ id: r.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
