const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// =============================
// GET ITEMS OF A CANTEEN
// =============================
router.get('/canteen/:canteenId', async (req, res) => {
  const { canteenId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT i.*, 
      IFNULL(r.avg_rating,0) as avg_rating, 
      IFNULL(r.count_rating,0) as count_rating 
       FROM items i 
       LEFT JOIN (
          SELECT item_id, AVG(rating) as avg_rating, COUNT(*) as count_rating 
          FROM ratings GROUP BY item_id
       ) r ON i.id = r.item_id
       WHERE i.canteen_id = ?`,
      [canteenId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =============================
// ADD ITEM (with image)
// =============================
router.post('/', upload.single('image'), async (req, res) => {
  const { name, description, price, canteen_id } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !canteen_id) return res.status(400).json({ error: 'Missing fields' });

  try {
    const [r] = await pool.query(
      'INSERT INTO items (name,description,price,canteen_id,image_url) VALUES (?,?,?,?,?)',
      [name, description || '', price || 0, canteen_id, image]
    );
    res.json({ id: r.insertId, image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
