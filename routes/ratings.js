const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET ratings for an item
router.get("/:itemId", async (req, res) => {
  const { itemId } = req.params;
  try {
    const result = await pool.query(
      `SELECT r.*, i.name as item_name 
       FROM ratings r 
       JOIN items i ON r.item_id = i.id
       WHERE r.item_id = $1
       ORDER BY r.id DESC`,
      [itemId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Rating Fetch Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ADD a rating
router.post("/", async (req, res) => {
  const { item_id, rating, comment, user_name, canteen_id } = req.body;

  if (!item_id || !rating) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const insert = await pool.query(
      `INSERT INTO ratings (item_id, rating, comment, user_name, canteen_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [item_id, rating, comment || "", user_name || "Anonymous", canteen_id]
    );

    res.json(insert.rows[0]);
  } catch (err) {
    console.error("Rating Insert Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
