// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.get('/login', (req, res) => {
  res.send('Auth route working ✅');
});

module.exports = router;
