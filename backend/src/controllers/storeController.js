const { pool } = require('../config/db');

const STORE_SORT_COLUMNS = {
  name: 'name',
  email: 'email',
  address: 'address',
  rating: 'rating',
  created_at: 'created_at',
};

function parseSort(sortBy, order, allowed, fallback) {
  const column = allowed[sortBy] || allowed[fallback];
  const direction = String(order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  return { column, direction };
}

// Admin: create a store, optionally tied to an owner user.
async function createStore(req, res, next) {
  try {
    const { name, email, address, ownerId } = req.body;
    const existing = await pool.query('SELECT 1 FROM stores WHERE email = $1', [email]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ message: 'A store with this email already exists.' });
    }
    if (ownerId) {
      const owner = await pool.query("SELECT role FROM users WHERE id = $1", [ownerId]);
      if (owner.rowCount === 0) {
        return res.status(400).json({ message: 'Selected owner does not exist.' });
      }
      if (owner.rows[0].role !== 'owner') {
        return res.status(400).json({ message: 'Selected user is not a store owner.' });
      }
    }
    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, address, owner_id`,
      [name, email, address, ownerId || null]
    );
    return res.status(201).json({ store: result.rows[0] });
  } catch (err) {
    return next(err);
  }
}

/**
 * List stores with average rating and the requesting user's own rating.
 * Used by both admins (full list) and normal users (browse + rate).
 * Supports filters (name, address) and sorting.
 */
async function listStores(req, res, next) {
  try {
    const { name, address, sortBy, order } = req.query;
    const { column, direction } = parseSort(sortBy, order, STORE_SORT_COLUMNS, 'name');

    const params = [req.user.id];
    const where = [];
    if (name) {
      params.push(`%${name}%`);
      where.push(`s.name ILIKE $${params.length}`);
    }
    if (address) {
      params.push(`%${address}%`);
      where.push(`s.address ILIKE $${params.length}`);
    }
    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const sql = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id,
             ROUND(COALESCE(AVG(r.rating), 0)::numeric, 2) AS rating,
             COUNT(r.id)::int AS rating_count,
             ur.rating AS user_rating
      FROM stores s
      LEFT JOIN ratings r  ON r.store_id = s.id
      LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $1
      ${whereClause}
      GROUP BY s.id, ur.rating
      ORDER BY ${column} ${direction}
    `;
    const result = await pool.query(sql, params);
    return res.json({ stores: result.rows });
  } catch (err) {
    return next(err);
  }
}

/**
 * Store Owner dashboard: the owner's store(s), average rating,
 * and the list of users who rated each store.
 */
async function getOwnerDashboard(req, res, next) {
  try {
    const storesRes = await pool.query(
      `SELECT s.id, s.name, s.email, s.address,
              ROUND(COALESCE(AVG(r.rating), 0)::numeric, 2) AS average_rating,
              COUNT(r.id)::int AS rating_count
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id = $1
       GROUP BY s.id
       ORDER BY s.name ASC`,
      [req.user.id]
    );

    const stores = storesRes.rows;
    if (stores.length === 0) {
      return res.json({ stores: [], raters: [], overallAverage: 0 });
    }

    const storeIds = stores.map((s) => s.id);
    const ratersRes = await pool.query(
      `SELECT r.store_id, s.name AS store_name,
              u.id AS user_id, u.name AS user_name, u.email AS user_email,
              r.rating, r.updated_at
       FROM ratings r
       JOIN users u  ON u.id = r.user_id
       JOIN stores s ON s.id = r.store_id
       WHERE r.store_id = ANY($1::int[])
       ORDER BY r.updated_at DESC`,
      [storeIds]
    );

    const overallRes = await pool.query(
      `SELECT ROUND(COALESCE(AVG(r.rating), 0)::numeric, 2) AS avg
       FROM ratings r
       JOIN stores s ON s.id = r.store_id
       WHERE s.owner_id = $1`,
      [req.user.id]
    );

    return res.json({
      stores,
      raters: ratersRes.rows,
      overallAverage: Number(overallRes.rows[0].avg),
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createStore, listStores, getOwnerDashboard };
