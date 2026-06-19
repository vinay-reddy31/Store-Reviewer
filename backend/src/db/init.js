/**
 * Creates the database (if missing) and applies schema.sql.
 * Run: npm run db:init
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const dbName = process.env.PGDATABASE || 'store_rating';

const baseConfig = {
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
};

async function ensureDatabase() {
  // Connect to the default 'postgres' db to create the target db if needed.
  const admin = new Client({ ...baseConfig, database: 'postgres' });
  await admin.connect();
  const exists = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
  if (exists.rowCount === 0) {
    await admin.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Created database "${dbName}".`);
  } else {
    console.log(`Database "${dbName}" already exists.`);
  }
  await admin.end();
}

async function applySchema() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const client = new Client({ ...baseConfig, database: dbName });
  await client.connect();
  await client.query(schema);
  console.log('Schema applied.');
  await client.end();
}

// Apply schema to a managed database via DATABASE_URL (database already exists).
async function applySchemaViaUrl() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  await client.query(schema);
  console.log('Schema applied to DATABASE_URL target.');
  await client.end();
}

(async () => {
  try {
    if (process.env.DATABASE_URL) {
      // Production / managed Postgres: the DB already exists, just apply schema.
      await applySchemaViaUrl();
    } else {
      await ensureDatabase();
      await applySchema();
    }
    console.log('Database initialization complete.');
    process.exit(0);
  } catch (err) {
    console.error('DB init failed:', err.message);
    process.exit(1);
  }
})();
