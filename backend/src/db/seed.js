/**
 * Seeds a default System Administrator and some sample data.
 * Safe to run multiple times (idempotent on emails).
 * Run: npm run db:seed
 */
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
require('dotenv').config();

async function upsertUser({ name, email, password, address, role }) {
  const hash = await bcrypt.hash(password, 10);
  const res = await pool.query(
    `INSERT INTO users (name, email, password, address, role)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id, email, role`,
    [name, email, hash, address, role]
  );
  return res.rows[0];
}

async function upsertStore({ name, email, address, ownerId }) {
  const res = await pool.query(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [name, email, address, ownerId]
  );
  return res.rows[0];
}

(async () => {
  try {
    const admin = await upsertUser({
      name: process.env.SEED_ADMIN_NAME || 'System Administrator Account',
      email: process.env.SEED_ADMIN_EMAIL || 'admin@storerating.com',
      password: process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',
      address: process.env.SEED_ADMIN_ADDRESS || 'HQ',
      role: 'admin',
    });
    console.log(`Seeded admin: ${admin.email}`);

    // Sample normal user
    await upsertUser({
      name: 'Normal Sample User Account One',
      email: 'user@storerating.com',
      password: 'User@12345',
      address: '12 Sample Avenue, Demo City',
      role: 'user',
    });

    // Sample store owner + store
    const owner = await upsertUser({
      name: 'Store Owner Sample Account One',
      email: 'owner@storerating.com',
      password: 'Owner@12345',
      address: '99 Market Road, Demo City',
      role: 'owner',
    });

    await upsertStore({
      name: 'The Corner Coffee Store',
      email: 'corner@store.com',
      address: '1 Bean Street, Demo City',
      ownerId: owner.id,
    });

    await upsertStore({
      name: 'Downtown Electronics Hub',
      email: 'electronics@store.com',
      address: '50 Tech Plaza, Demo City',
      ownerId: null,
    });

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
})();
