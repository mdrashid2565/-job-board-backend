// 📂 File: backend/server.js

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

/**
 * 🔧 ✅ Final stable CORS configuration
 * - Handles preflight OPTIONS requests
 * - Sends proper Access-Control-Allow-Origin header
 * - Supports credentials securely
 */
const allowedOrigins = ['https://delightful-cupcake-2db337.netlify.app'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman) or from allowedOrigins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // include OPTIONS
  credentials: true,
};

// ✅ Apply CORS globally before all routes
app.use(cors(corsOptions));

// ✅ Handle preflight OPTIONS requests globally
app.options('*', cors(corsOptions));

/**
 * 🐞 ✅ Debugging: log all incoming requests for troubleshooting
 */
app.use((req, res, next) => {
  console.log(`➡️ Incoming request: ${req.method} ${req.url}`);
  next();
});

// 🔓 Global Middleware
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
  res.status(500).json({ message: 'Something went wrong on the server!', error: err.message });
});

// 🌍 Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
