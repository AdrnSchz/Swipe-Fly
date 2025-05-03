const dotenv = require("dotenv");
const { Pool } = require("pg"); // Replace with the correct library if not pg

dotenv.config();

const pool = new Pool({
    connectionString: process.env.TURSO_DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Optional: Use if SSL is required
    headers: { Authorization: `Bearer ${process.env.TURSO_AUTH_TOKEN}` }, // Add headers if needed
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool
};