const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const authRoutes = require("./Routes/auth");
const flightsRoutes = require('./Routes/flight');
const userRoutes = require("./Routes/user");
const db = require("./db");

// Load environment variables from .env in backend directory
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();

// ======================
// Middlewares
// ======================
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan("dev")); // Request logging

// ======================
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightsRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// ======================
// JWT Authentication Middleware
// ======================
const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.split(" ")[1]; // Get token after 'Bearer '

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Example protected route
app.get("/api/profile", authenticate, async (req, res) => {
  try {
    const user = await db.query(
      "SELECT id, username, email FROM users WHERE id = ?",
      [req.user.id]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ======================
// Error Handling
// ======================
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  
  // Handle JWT errors specifically
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }
  
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    }
  });
});

// ======================
// Server Startup
// ======================
const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  
  try {
    // Test database connection
    await db.query("SELECT 1");
    console.log("✅ Database connected successfully");
    
    // Additional startup checks can go here
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Exit if DB connection fails
  }
});

// Export for testing
module.exports = app;