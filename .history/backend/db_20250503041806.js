const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from the backend directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Debug: Show loaded environment variables
console.log('Environment variables:');
console.log('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL ? '***SET***' : 'MISSING');
console.log('TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? '***SET***' : 'MISSING');

// Fallback to local SQLite if Turso config missing
if (!process.env.TURSO_DATABASE_URL) {
  console.warn('Using local SQLite database as fallback');
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database('./local.db');
  
  module.exports = {
    query: (text, params) => new Promise((resolve, reject) => {
      db.all(text, params, (err, rows) => {
        if (err) reject(err);
        else resolve({ rows });
      });
    })
  };
} else {
  // Use Turso if configured
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  });

  module.exports = {
    query: async (text, params) => {
      const result = await client.execute({
        sql: text,
        args: params || []
      });
      return { rows: result.rows };
    }
  };
}