const mongoose = require('mongoose');
const { APPLICATION_STATUS } = require('../config/constants');

const applicationSchema = new mongoose.Schema(
  {
    jobSeeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobSeeker',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    coverLetter: {
      type: String,
      required: [true, 'A short cover letter is required'],
      trim: true,
      minlength: [20, 'Write at least 20 characters'],
      maxlength: [3000, 'Cover letter is too long'],
    },
    status: {
      type: String,
      enum: APPLICATION_STATUS,
      default: 'Pending',
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

applicationSchema.index({ jobSeeker: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);