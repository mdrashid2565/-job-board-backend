// 📂 File: backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * 🔐 Middleware: Protect Routes
 * Verifies JWT token and attaches user data to req.user
 */
exports.protect = async (req, res, next) => {
  let token;

  // ✅ Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Find user and attach to request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'No user found with this token' });
      }

      next();
    } catch (err) {
      console.error('❌ Token Verification Error:', err);
      return res.status(401).json({ message: 'Not authorized, token failed', error: err.message });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * 🔐 Middleware: Authorize Roles
 * Restricts access based on user roles
 */
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role (${req.user.role}) not allowed to access this resource` });
    }
    next();
  };
};
