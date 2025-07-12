// 📂 File: backend/routes/jobRoutes.js

const express = require('express');
const router = express.Router();

// ✅ Import controllers
const {
  createJob,
  getAllJobs,
  getEmployerJobs,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');

// ✅ Import middleware
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// ✅ ROUTES

router.post('/', protect, authorizeRoles('employer'), createJob);
router.get('/', protect, getAllJobs);
router.get('/employer/jobs', protect, authorizeRoles('employer'), getEmployerJobs);
router.put('/:id', protect, authorizeRoles('employer'), updateJob);
router.delete('/:id', protect, authorizeRoles('employer'), deleteJob);

module.exports = router;
