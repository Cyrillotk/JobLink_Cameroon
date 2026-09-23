const mongoose = require('mongoose');
const { JOB_TYPES, JOB_STATUS } = require('../config/constants');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [140, 'Title is too long'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description is too long'],
    },
    requirements: { type: String, trim: true, maxlength: 3000 },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: { values: JOB_TYPES, message: 'Choose a valid job type' },
      required: [true, 'Job type is required'],
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
    },
    status: {
      type: String,
      enum: JOB_STATUS,
      default: 'active',
    },
  },
  { timestamps: true }
);

jobSchema.index({ employer: 1, title: 1, location: 1 }, { unique: true });
jobSchema.index({ title: 'text', description: 'text' });

jobSchema.virtual('isOpen').get(function () {
  return this.status === 'active' && this.deadline >= new Date();
});

jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);