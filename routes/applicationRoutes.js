// 📂 File: backend/routes/applicationRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  applyJob,
  getJobApplications,
  shortlistApplication,
  rejectApplication
} = require('../controllers/applicationController');

// ✅ Apply for a job with resume upload
router.post('/:id/apply', protect, upload.single('resume'), applyJob);

// ✅ Get all applications for a job (Employer view)
router.get('/:id/applications', protect, getJobApplications);

// ✅ Shortlist an application
router.put('/:id/shortlist', protect, shortlistApplication);

// ✅ Reject an application
router.put('/:id/reject', protect, rejectApplication);

module.exports = router;
