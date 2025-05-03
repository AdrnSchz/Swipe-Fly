require('dotenv').config({ path: __dirname + '/.env' }); // Explicit path

console.log('Environment Variables:');
console.log('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL);
console.log('TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? '***REDACTED***' : 'MISSING');

const { createClient } = require('@libsql/client');

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is missing from .env file');
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function test() {
  try {
    const result = await client.execute('SELECT 1');
    console.log('✅ Connection successful!');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

test();