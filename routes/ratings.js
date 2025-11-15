const express = require('express');
const router = express.Router();
const pool = require('../db');

// submit rating { item_id, rating (1-5), comment, user_name (optional) }
router.post('/', async (req, res) => {
  const { item_id, rating, comment, user_name } = req.body;
  if (!item_id || !rating) return res.status(400).json({ error: 'Missing fields' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Invalid rating' });
  try {
    const [r] = await pool.query('INSERT INTO ratings (item_id, rating, comment, user_name, created_at) VALUES (?,?,?,?,NOW())', [item_id, rating, comment || null, user_name || null]);
    res.json({ id: r.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// get ratings for an item
router.get('/item/:itemId', async (req, res) => {
  const { itemId } = req.params;
  try {
    const [rows] = await pool.query('SELECT id,item_id,rating,comment,user_name,created_at FROM ratings WHERE item_id=? ORDER BY created_at DESC', [itemId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// top items across canteens (by average rating, min 3 ratings)
router.get('/top', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT i.id,i.name,i.description,i.price,i.canteen_id, ROUND(AVG(r.rating),2) as avg_rating, COUNT(r.id) as count_rating FROM items i JOIN ratings r ON i.id=r.item_id GROUP BY i.id HAVING COUNT(r.id) >= 1 ORDER BY avg_rating DESC, count_rating DESC LIMIT 20");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
