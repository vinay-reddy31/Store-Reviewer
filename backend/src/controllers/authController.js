const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, address: u.address, role: u.role };
}

// Public self-registration -> always a normal user.
async function signup(req, res, next) {
  try {
    const { name, email, password, address } = req.body;
    const existing = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, 'user')
       RETURNING id, name, email, address, role`,
      [name, email, hash, address]
    );
    const user = result.rows[0];
    return res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    return res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, address, role FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ user: result.rows[0] });
  } catch (err) {
    return next(err);
  }
}

// Any authenticated user can change their own password.
async function updatePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await pool.query('SELECT password FROM users WHERE id = $1', [req.user.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const ok = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!ok) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1, updated_at = now() WHERE id = $2', [
      hash,
      req.user.id,
    ]);
    return res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { signup, login, me, updatePassword };
