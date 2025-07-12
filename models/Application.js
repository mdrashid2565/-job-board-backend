// 📂 File: backend/models/Application.js

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      min: [0, 'Experience cannot be negative'],
    },
    currentRole: {
      type: String,
      required: true,
      trim: true,
    },
    skills: {
      type: String,
      default: '',
      trim: true,
    },
    portfolioURL: {
      type: String,
      default: '',
      trim: true,
    },
    resume: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
