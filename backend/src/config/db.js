const { Pool } = require('pg');
require('dotenv').config();

// In production we use a single DATABASE_URL connection string (Neon/Render/etc.),
// which requires SSL. Locally we fall back to discrete PG* variables, no SSL.
const useConnectionString = !!process.env.DATABASE_URL;

const pool = new Pool(
  useConnectionString
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
      }
    : {
        host: process.env.PGHOST || 'localhost',
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'store_rating',
        max: 10,
        idleTimeoutMillis: 30000,
      }
);

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected PostgreSQL pool error:', err);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};
