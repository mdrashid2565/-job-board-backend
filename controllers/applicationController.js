// 📂 File: backend/controllers/applicationController.js

const Application = require('../models/Application');
const Job = require('../models/Job');
const sendEmail = require('../utils/email'); // ✅ Added: Import sendEmail utility

/**
 * 🎯 Apply for a Job
 */
exports.applyJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const { experience, currentRole, skills, portfolioURL } = req.body;
    const resume = req.file ? `resumes/${req.file.filename}` : application.resume;

    if (!experience || !currentRole || !resume) {
      return res.status(400).json({ message: 'Experience, current role, and resume are required.' });
    }

    // 🔍 Check if application already exists for this job and user
    let application = await Application.findOne({ job: jobId, applicant: req.user._id });

    if (application) {
      // If exists, update it (Edit Application)
      application.experience = experience;
      application.currentRole = currentRole;
      application.skills = skills;
      application.portfolioURL = portfolioURL;
      if (resume) application.resume = resume;

      await application.save();
      return res.status(200).json({
        success: true,
        message: 'Application updated successfully.',
        application,
      });
    }

    // Else create new application
    application = new Application({
      job: jobId,
      applicant: req.user._id,
      experience,
      currentRole,
      skills,
      portfolioURL,
      resume,
    });

    await application.save();

    // 🔗 Push application to job's applications array
    await Job.findByIdAndUpdate(jobId, { $push: { applications: application._id } });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      application,
    });
  } catch (err) {
    console.error('❌ Apply Job Error:', err);
    res.status(500).json({ message: 'Server error while applying for job.' });
  }
};

/**
 * 📝 Get Applications for a Job (Employer view)
 */
exports.getJobApplications = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const job = await Job.findById(jobId).populate({
      path: 'applications',
      populate: { path: 'applicant', select: 'name email' },
    });

    if (!job) return res.status(404).json({ message: 'Job not found' });

    res.status(200).json(job.applications);
  } catch (err) {
    console.error('❌ Get Applications Error:', err);
    res.status(500).json({ message: 'Server error while fetching applications.' });
  }
};

/**
 * ✅ Shortlist an applicant
 */
exports.shortlistApplication = async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const application = await Application.findById(applicationId).populate('applicant');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'shortlisted';
    await application.save();

    // ✅ Added: Send email notification on shortlist
    await sendEmail(
      application.applicant.email,
      'Your Application has been Shortlisted!',
      `Hello ${application.applicant.name},\n\nCongratulations! Your application for job ID ${application.job} has been shortlisted.\n\nBest regards,\nJob Board Team`
    );

    res.status(200).json({
      success: true,
      message: 'Application shortlisted successfully.',
      application,
    });
  } catch (err) {
    console.error('❌ Shortlist Application Error:', err);
    res.status(500).json({ message: 'Server error while shortlisting application.' });
  }
};

/**
 * ❌ Reject an applicant
 */
exports.rejectApplication = async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const application = await Application.findById(applicationId).populate('applicant');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'rejected';
    await application.save();

    // ✅ Added: Send email notification on rejection
    await sendEmail(
      application.applicant.email,
      'Your Application has been Rejected',
      `Hello ${application.applicant.name},\n\nWe regret to inform you that your application for job ID ${application.job} has been rejected.\n\nBest wishes,\nJob Board Team`
    );

    res.status(200).json({
      success: true,
      message: 'Application rejected successfully.',
      application,
    });
  } catch (err) {
    console.error('❌ Reject Application Error:', err);
    res.status(500).json({ message: 'Server error while rejecting application.' });
  }
};
