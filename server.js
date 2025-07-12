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

/**
 * 🔧 ✅ Final stable CORS configuration (handles preflight OPTIONS requests safely)
 */
const allowedOrigins = ['https://delightful-cupcake-2db337.netlify.app'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // include OPTIONS for preflight
  credentials: true,
};

// ✅ Apply CORS globally before routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight OPTIONS requests globally

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
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// 🌍 Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
