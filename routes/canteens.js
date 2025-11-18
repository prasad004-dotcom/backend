const express = require('express');
const router = express.Router();
const pool = require('../db');


// list canteens
router.get('/', async (req, res) => {
try {
const result = await pool.query('SELECT id, name, location FROM canteens ORDER BY name');
res.json(result.rows);
} catch (err) {
console.error('GET /api/canteens error', err.message || err);
res.status(500).json({ error: 'Server error' });
}
});


// add canteen
router.post('/', async (req, res) => {
const { name, location } = req.body;
if (!name) return res.status(400).json({ error: 'Missing name' });
try {
const result = await pool.query(
'INSERT INTO canteens (name, location) VALUES ($1, $2) RETURNING id',
[name, location || null]
);
res.json({ id: result.rows[0].id });
} catch (err) {
console.error('POST /api/canteens error', err.message || err);
res.status(500).json({ error: 'Server error' });
}
});


module.exports = router;