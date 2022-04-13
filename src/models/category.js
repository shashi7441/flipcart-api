const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    category: {
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
    createdBy: {
      type: String,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Category = new mongoose.model('Category', categorySchema);

module.exports = Category;
