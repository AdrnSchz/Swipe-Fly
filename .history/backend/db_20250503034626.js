const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

module.exports = {
  query: async (text, params) => {
    try {
      const result = await client.execute({
        sql: text,
        args: params
      });
      return { rows: result.rows };
    } catch (err) {
      console.error("Database error:", err);
      throw err;
    }
  },
  client
};