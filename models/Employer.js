const mongoose = require("mongoose");
const { JOB_TYPES, JOB_STATUS } = require("../config/constants");

const employerSchema = new mongoose.Schema(
    {
        name: {
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

        availableDays: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const Employer = mongoose.model("Employer", employerSchema);
module.exports = Employer;