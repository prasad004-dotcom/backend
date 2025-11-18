const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/canteen/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT i.*,
        COALESCE(avg_r.avg_rating, 0) AS avg_rating,
        COALESCE(avg_r.count_rating, 0) AS count_rating
      FROM items i
      LEFT JOIN (
        SELECT item_id, AVG(rating)::numeric(10,2) AS avg_rating, COUNT(*) AS count_rating
        FROM ratings
        GROUP BY item_id
      ) AS avg_r ON i.id = avg_r.item_id
      WHERE i.canteen_id = $1
      ORDER BY i.id
      `,
      [req.params.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Item List Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
