const express = require("express");
const router = express.Router();
const pool = require("../db");

// ==========================
// ADD RATING
// ==========================
router.post("/", async (req, res) => {
  const { item_id, rating, comment, user_name } = req.body;

  if (!item_id || !rating) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await pool.query(
      `INSERT INTO ratings (item_id, rating, comment, user_name)
       VALUES ($1, $2, $3, $4)`,
      [item_id, rating, comment || "", user_name || ""]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Rating Insert Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================
// TOP RATED ITEMS
// ==========================
router.get("/top", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.id, i.name, i.description,
             COALESCE(AVG(r.rating), 0) AS avg_rating,
             COUNT(r.rating) AS count_rating
      FROM items i
      LEFT JOIN ratings r ON i.id = r.item_id
      GROUP BY i.id
      ORDER BY avg_rating DESC
      LIMIT 10
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Top Items Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
