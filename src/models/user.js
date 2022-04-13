const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { date } = require('joi');
const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['admin', 'seller', 'user'],
    },
    email: String,
    phone: String,
    fullName: String,
    password: String,
    photo: String,
    aboutUs: String,
    otp: {
      type: String,
      default: null,
    },
    refreshToken: String,
    isActive: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    createdAt: Date,
    updatedAt: Date,
    resetTime: Date,
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (req, res, next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
    // const time = new Date()
    this.resetTime = Date.now() + 10 * 60000;
  }
  next();
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
