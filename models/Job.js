const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        requirements: {
            type: [String],
            default: []
        },
        type: {
              type: String,
              enum: { values: JOB_TYPES, message: 'Choose a valid job type' },
              required: true
            },
         deadline: {
              type: Date,
              required: [true, 'Application deadline is required'],
            },
            employer: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Employer',
              required: true
            },
            status: {
              type: String,
              enum: JOB_STATUS,
              default: 'active'
            },
    },
    {
        timestamps: true
    }
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;