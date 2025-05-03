require('dotenv').config();
const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function test() {
  try {
    const result = await client.execute('SELECT 1');
    console.log('✅ Connection successful!');
    console.log('Database URL:', process.env.TURSO_DATABASE_URL);
  } catch (err) {
    console.error('❌ Connection failed:');
    console.error(err.message);
  }
}

test();