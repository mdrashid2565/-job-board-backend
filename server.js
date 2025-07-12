// ✅ backend/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// 🔐 Load environment variables from .env
dotenv.config();

// 🔗 Connect to MongoDB
connectDB();

// 🚀 Initialize Express app
const app = express();

// 🔓 Global Middleware
app.use(cors()); // Handle cross-origin requests
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: true })); // Handle form-data if any

// ✅ Serve uploaded files (entire uploads folder)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api/auth', require('./routes/authRoutes')); // Login & Register routes
app.use('/api/jobs', require('./routes/jobRoutes')); // Job CRUD routes
app.use('/api/applications', require('./routes/applicationRoutes')); // Job applications routes

// 🛠️ Global Error Handler (Optional but helpful)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// 🌍 Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
