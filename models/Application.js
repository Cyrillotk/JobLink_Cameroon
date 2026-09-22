const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobSeeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobSeeker',
      required: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    coverLetter: {
      type: String,
      required: true,
      trim: true,
      maxlength: [3000, 'Cover letter is too long']
    },
    status: {
      type: String,
      enum: APPLICATION_STATUS,
      default: 'Pending'
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
