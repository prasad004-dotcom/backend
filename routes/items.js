const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET ITEMS OF A CANTEEN
router.get("/canteen/:canteenId", async (req, res) => {
  const { canteenId } = req.params;

  try {
    const result = await pool.query(
      `SELECT i.*, 
      COALESCE(r.avg_rating, 0) AS avg_rating,
      COALESCE(r.count_rating, 0) AS count_rating
      FROM items i
      LEFT JOIN (
        SELECT item_id, AVG(rating) AS avg_rating, COUNT(*) AS count_rating
        FROM ratings 
        GROUP BY item_id
      ) r ON i.id = r.item_id
      WHERE i.canteen_id = $1`,
      [canteenId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get Items Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ADD ITEM (NO IMAGE)
router.post("/", async (req, res) => {
  const { name, description, price, canteen_id } = req.body;

  if (!name || !canteen_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO items (name, description, price, canteen_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [name, description || "", price || 0, canteen_id]
    );

    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error("Add Item Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
