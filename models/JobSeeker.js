const mongoose = require('mongoose');

const jobSeekerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [120, 'Name is too long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    phone: { type: String, trim: true, maxlength: 30 },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.length <= 25,
        message: 'List at most 25 skills',
      },
    },
    education: { type: String, trim: true, maxlength: 1000 },
    experience: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobSeeker', jobSeekerSchema);