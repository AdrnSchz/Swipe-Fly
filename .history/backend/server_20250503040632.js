const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require('morgan');
const authRoutes = require('./Routes/auth');
const db = require('./db');

dotenv.config();

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); 
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});

app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || "Internal Server Error",
        },
    });
});

// --- Start Server ---
const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  try {
    const result = await db.query('SELECT NOW()'); // Test query to check database connection
    console.log("Database connected successfully:", result.rows[0]);
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
});