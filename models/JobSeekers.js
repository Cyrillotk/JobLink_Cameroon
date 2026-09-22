const mongoose = require("mongoose");

const jobseekerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        jobseekerId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        age: {
            type: Number,
            required: true,
            min: 0
        },

        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Other"]
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        address: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const JobSeeker = mongoose.model("JobSeeker", jobseekerSchema);
module.exports = JobSeeker;
