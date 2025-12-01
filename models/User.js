// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fingerprintTemplate: {
      type: String,
      required: true,
    },
    secret: {
      type: String, // this will be used later for dynamic password (TOTP)
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
