const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// ensure uploads directory exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');


// Storage config
const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, 'uploads/'),
filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});


const upload = multer({ storage });


// GET ITEMS OF A CANTEEN
router.get('/canteen/:canteenId', async (req, res) => {
const { canteenId } = req.params;
try {
const result = await pool.query(
`SELECT i.*,
COALESCE(r.avg_rating, 0) as avg_rating,
COALESCE(r.count_rating, 0) as count_rating
FROM items i
LEFT JOIN (
SELECT item_id, AVG(rating) as avg_rating, COUNT(*) as count_rating
FROM ratings
GROUP BY item_id
) r ON i.id = r.item_id
WHERE i.canteen_id = $1`,
[canteenId]
);
res.json(result.rows);
} catch (err) {
console.error('GET /api/items/canteen/:canteenId error', err.message || err);
res.status(500).json({ error: 'Server error' });
}
});


// ADD ITEM (with image)
router.post('/', upload.single('image'), async (req, res) => {
const { name, description, price, canteen_id } = req.body;
const image = req.file ? req.file.filename : null;


if (!name || !canteen_id) return res.status(400).json({ error: 'Missing fields' });


try {
const result = await pool.query(
'INSERT INTO items (name, description, price, canteen_id, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING id',
[name, description || '', price || 0, canteen_id, image]
);
res.json({ id: result.rows[0].id, image });
} catch (err) {
console.error('POST /api/items error', err.message || err);
res.status(500).json({ error: 'Server error' });
}
});


module.exports = router;