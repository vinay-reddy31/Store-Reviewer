const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// Whitelist of sortable columns to avoid SQL injection via order params.
const USER_SORT_COLUMNS = {
  name: 'name',
  email: 'email',
  address: 'address',
  role: 'role',
  created_at: 'created_at',
};

function parseSort(sortBy, order, allowed, fallback) {
  const column = allowed[sortBy] || allowed[fallback];
  const direction = String(order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  return { column, direction };
}

// Admin: dashboard counts.
async function getDashboardStats(req, res, next) {
  try {
    const [users, stores, ratings] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM users'),
      pool.query('SELECT COUNT(*)::int AS count FROM stores'),
      pool.query('SELECT COUNT(*)::int AS count FROM ratings'),
    ]);
    return res.json({
      totalUsers: users.rows[0].count,
      totalStores: stores.rows[0].count,
      totalRatings: ratings.rows[0].count,
    });
  } catch (err) {
    return next(err);
  }
}

// Admin: create a user of any role.
async function createUser(req, res, next) {
  try {
    const { name, email, password, address, role } = req.body;
    const existing = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, address, role`,
      [name, email, hash, address, role || 'user']
    );
    return res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    return next(err);
  }
}

// Admin: list users with optional filters + sorting.
// Owners include their store's average rating.
async function listUsers(req, res, next) {
  try {
    const { name, email, address, role, sortBy, order } = req.query;
    const { column, direction } = parseSort(sortBy, order, USER_SORT_COLUMNS, 'name');

    const where = [];
    const params = [];
    if (name) {
      params.push(`%${name}%`);
      where.push(`u.name ILIKE $${params.length}`);
    }
    if (email) {
      params.push(`%${email}%`);
      where.push(`u.email ILIKE $${params.length}`);
    }
    if (address) {
      params.push(`%${address}%`);
      where.push(`u.address ILIKE $${params.length}`);
    }
    if (role) {
      params.push(role);
      where.push(`u.role = $${params.length}`);
    }
    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const sql = `
      SELECT u.id, u.name, u.email, u.address, u.role,
             CASE WHEN u.role = 'owner'
                  THEN ROUND(AVG(r.rating)::numeric, 2)
                  ELSE NULL END AS rating
      FROM users u
      LEFT JOIN stores s ON s.owner_id = u.id
      LEFT JOIN ratings r ON r.store_id = s.id
      ${whereClause}
      GROUP BY u.id
      ORDER BY ${column} ${direction}
    `;
    const result = await pool.query(sql, params);
    return res.json({ users: result.rows });
  } catch (err) {
    return next(err);
  }
}

// Admin: single user detail; owner gets rating.
async function getUser(req, res, next) {
  try {
    const { id } = req.params;
    const sql = `
      SELECT u.id, u.name, u.email, u.address, u.role,
             CASE WHEN u.role = 'owner'
                  THEN ROUND(AVG(r.rating)::numeric, 2)
                  ELSE NULL END AS rating
      FROM users u
      LEFT JOIN stores s ON s.owner_id = u.id
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE u.id = $1
      GROUP BY u.id
    `;
    const result = await pool.query(sql, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ user: result.rows[0] });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getDashboardStats, createUser, listUsers, getUser };
