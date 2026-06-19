const { pool } = require('../config/db');

/**
 * Normal user submits or updates a rating (1-5) for a store.
 * Upsert keyed on (user_id, store_id) so re-submitting modifies the rating.
 */
async function submitRating(req, res, next) {
  try {
    const storeId = Number(req.params.storeId);
    const { rating } = req.body;

    const store = await pool.query('SELECT 1 FROM stores WHERE id = $1', [storeId]);
    if (store.rowCount === 0) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    const result = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id)
       DO UPDATE SET rating = EXCLUDED.rating, updated_at = now()
       RETURNING id, store_id, rating, created_at, updated_at`,
      [req.user.id, storeId, rating]
    );
    return res.status(201).json({ rating: result.rows[0] });
  } catch (err) {
    return next(err);
  }
}

module.exports = { submitRating };
