const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Photo',
    },
    createdAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Brand = new mongoose.model('Brand', brandSchema);

module.exports = Brand;
