/**
 * Richer demo dataset: extra owners, normal users, stores, and ratings.
 * Idempotent (keyed on emails / (user, store) pairs) - safe to re-run.
 * Run: npm run db:seed:demo   (uses DATABASE_URL if set, else local PG* vars)
 *
 * All demo account passwords:
 *   normal users -> User@12345
 *   store owners -> Owner@12345
 */
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
require('dotenv').config();

// Names are intentionally >= 20 chars to satisfy the validation rule.
const OWNERS = [
  { name: 'Rajesh Kumar Business Owner', email: 'rajesh.owner@store.com', address: '12 MG Road, Bengaluru' },
  { name: 'Priya Sharma Retail Proprietor', email: 'priya.owner@store.com', address: '88 Park Street, Kolkata' },
  { name: 'Arjun Mehta Enterprises Head', email: 'arjun.owner@store.com', address: '5 Marine Drive, Mumbai' },
  { name: 'Sneha Reddy Store Proprietor', email: 'sneha.owner@store.com', address: '21 Jubilee Hills, Hyderabad' },
];

const USERS = [
  { name: 'Vikram Singh Normal Customer', email: 'vikram.user@store.com', address: '3 Sector 17, Chandigarh' },
  { name: 'Anjali Gupta Regular Shopper', email: 'anjali.user@store.com', address: '45 Civil Lines, Jaipur' },
  { name: 'Rohan Desai Platform Member', email: 'rohan.user@store.com', address: '9 FC Road, Pune' },
  { name: 'Kavya Nair Frequent Reviewer', email: 'kavya.user@store.com', address: '77 MG Road, Kochi' },
  { name: 'Aditya Joshi Account Holder Person', email: 'aditya.user@store.com', address: '14 Lal Bagh, Lucknow' },
  { name: 'Meera Iyer Verified Customer User', email: 'meera.user@store.com', address: '52 Anna Salai, Chennai' },
];

// Stores keyed by ownerEmail (null = no owner).
const STORES = [
  { name: 'Sunrise Grocery Supermarket', email: 'sunrise@store.com', address: '101 Market Lane, Bengaluru', ownerEmail: 'rajesh.owner@store.com' },
  { name: 'Tech Galaxy Gadget Store', email: 'techgalaxy@store.com', address: '202 Silicon Avenue, Hyderabad', ownerEmail: 'sneha.owner@store.com' },
  { name: 'Bloom Florist And Gifts', email: 'bloom@store.com', address: '303 Garden Road, Kolkata', ownerEmail: 'priya.owner@store.com' },
  { name: 'Fitness First Sports Center', email: 'fitness@store.com', address: '404 Health Street, Mumbai', ownerEmail: 'arjun.owner@store.com' },
  { name: 'Page Turner Book Boutique', email: 'pageturner@store.com', address: '505 Library Lane, Pune', ownerEmail: 'rajesh.owner@store.com' },
  { name: 'Urban Bites Fast Food Joint', email: 'urbanbites@store.com', address: '606 Food Court, Chennai', ownerEmail: null },
];

async function upsertUser({ name, email, address, role }, password) {
  const hash = await bcrypt.hash(password, 10);
  const res = await pool.query(
    `INSERT INTO users (name, email, password, address, role)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address
     RETURNING id`,
    [name, email, hash, address, role]
  );
  return res.rows[0].id;
}

async function upsertStore({ name, email, address }, ownerId) {
  const res = await pool.query(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, owner_id = EXCLUDED.owner_id
     RETURNING id`,
    [name, email, address, ownerId]
  );
  return res.rows[0].id;
}

async function upsertRating(userId, storeId, rating) {
  await pool.query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, store_id) DO UPDATE SET rating = EXCLUDED.rating, updated_at = now()`,
    [userId, storeId, rating]
  );
}

(async () => {
  try {
    const ownerIds = {};
    for (const o of OWNERS) ownerIds[o.email] = await upsertUser({ ...o, role: 'owner' }, 'Owner@12345');
    console.log(`Owners ready: ${OWNERS.length}`);

    const userIds = [];
    for (const u of USERS) userIds.push(await upsertUser({ ...u, role: 'user' }, 'User@12345'));
    console.log(`Normal users ready: ${USERS.length}`);

    const storeIds = [];
    for (const s of STORES) {
      const ownerId = s.ownerEmail ? ownerIds[s.ownerEmail] : null;
      storeIds.push(await upsertStore(s, ownerId));
    }
    console.log(`Stores ready: ${STORES.length}`);

    // Spread varied ratings across users and stores (deterministic pattern).
    let count = 0;
    for (let u = 0; u < userIds.length; u++) {
      for (let s = 0; s < storeIds.length; s++) {
        // Skip a few combinations so not every user rates every store.
        if ((u + s) % 4 === 3) continue;
        const rating = ((u * 2 + s * 3) % 5) + 1; // 1..5
        await upsertRating(userIds[u], storeIds[s], rating);
        count++;
      }
    }
    console.log(`Ratings upserted: ${count}`);
    console.log('Demo seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Demo seeding failed:', err.message);
    process.exit(1);
  }
})();
