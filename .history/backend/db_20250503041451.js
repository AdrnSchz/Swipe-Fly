const { createClient } = require('@libsql/client'); // Turso's official client
const dotenv = require('dotenv');

dotenv.config();

// Validate environment variables
if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('Missing TURSO_DATABASE_URL in .env');
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN // Only needed for remote Turso DB
});

// Test connection immediately (optional)
client.execute("SELECT 1")
  .then(() => console.log("✓ Turso DB connected"))
  .catch(err => console.error("✗ DB connection failed:", err.message));

module.exports = {
  query: async (text, params) => {
    const result = await client.execute({
      sql: text,
      args: params || []
    });
    return { rows: result.rows };
  },
  client // Export client for transactions
};