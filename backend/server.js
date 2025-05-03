const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const authRoutes = require("./Routes/auth");
const flightsRoutes = require('./Routes/flight');
const userRoutes = require("./Routes/user");
const groupRoutes = require("./Routes/groups");
const userPreferencesRoutes = require("./Routes/user_preferences");
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
app.use('/api/groups', groupRoutes);
app.use('/api/user_preferences', userPreferencesRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
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
      message: err.message || "Internal Server Error"
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