// 📂 File: backend/controllers/jobController.js

const Job = require('../models/Job');

/**
 * ✅ Create a new job (Employer only)
 */
exports.createJob = async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      postedBy: req.user._id, // ensures the employer is linked
    });
    await job.save();
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (err) {
    console.error('❌ Job Creation Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * ✅ Get all jobs (Job seekers)
 */
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('postedBy', 'name email role')
      .sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error('❌ Fetch Jobs Error:', err);
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
};

/**
 * ✅ Get jobs posted by this employer with applications and applicant details
 */
exports.getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate({
        path: 'applications',
        populate: { path: 'applicant', select: 'name email role' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (err) {
    console.error('❌ Error fetching employer jobs:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * ✅ Update (edit) a job post by ID (Employer only)
 */
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (err) {
    console.error('❌ Update Job Error:', err);
    res.status(500).json({ message: 'Failed to update job', error: err.message });
  }
};

/**
 * ✅ Delete a job post by ID (Employer only)
 */
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('❌ Delete Job Error:', err);
    res.status(500).json({ message: 'Failed to delete job', error: err.message });
  }
};
