const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        adminname: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        passwordHash: {
            type: String,
            required: true
        },

        role: {
            type: String,
            default: "staff"
        }
    },
    {
        timestamps: true
    }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
