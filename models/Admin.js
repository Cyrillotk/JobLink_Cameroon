const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        adminname: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
          email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
        passwordHash: {
            type: String,
            required: true
        },

        role: {
            type: String,
            default: "staff"
        },
        status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    }
    },
    {
        timestamps: true
    },
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
