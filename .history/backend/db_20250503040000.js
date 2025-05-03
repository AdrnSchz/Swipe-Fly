const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');

dotenv.config();

// Verify environment variables
if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error('Missing Turso database configuration in .env file');
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Test connection immediately
client.execute('SELECT 1')
  .then(() => console.log('✓ Connected to Turso database'))
  .catch(err => console.error('✗ Connection failed:', err.message));

module.exports = {
  query: async (text, params) => {
    const result = await client.execute({
      sql: text,
      args: params || []
    });
    return { rows: result.rows };
  },
  client
};