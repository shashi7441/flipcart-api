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
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
    createdBy: {
      type: String,
    },
  },
  { timestamps: true }
);

const Brand = new mongoose.model('Brand', brandSchema);

module.exports = Brand;
