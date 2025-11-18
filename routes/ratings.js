const express = require('express');
const router = express.Router();
const pool = require('../db');


// submit a rating
router.post('/', async (req, res) => {
const { item_id, rating, comment, user_name } = req.body;
if (!item_id || !rating) return res.status(400).json({ error: 'Missing fields' });
try {
const result = await pool.query(
'INSERT INTO ratings (item_id, rating, comment, user_name) VALUES ($1, $2, $3, $4) RETURNING id',
[item_id, rating, comment || '', user_name || '']
);
res.json({ id: result.rows[0].id });
} catch (err) {
console.error('POST /api/ratings error', err.message || err);
res.status(500).json({ error: 'Server error' });
}
});


// top items (by average rating)
router.get('/top', async (req, res) => {
try {
const result = await pool.query(
`SELECT i.*, COALESCE(r.avg_rating,0) as avg_rating, COALESCE(r.count_rating,0) as count_rating
FROM items i
LEFT JOIN (
SELECT item_id, AVG(rating) as avg_rating, COUNT(*) as count_rating
FROM ratings
GROUP BY item_id
) r ON i.id = r.item_id
ORDER BY r.avg_rating DESC NULLS LAST
LIMIT 20`
);
res.json(result.rows);
} catch (err) {
console.error('GET /api/ratings/top error', err.message || err);
res.status(500).json({ error: 'Server error' });
}
});


module.exports = router;