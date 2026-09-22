const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/
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

const User = mongoose.model("User", userSchema);
module.exports = User;
