const { string } = require('joi');
const mongoose = require('mongoose');

const imageSchema = mongoose.Schema(
  {
    image: [{ url: String, public_id: String }],
    productId: {
      type: String,
      createdAt: Date,
      updatedAt: Date,
    },
    categoryId: {
      type: String,
      createdAt: Date,
      updatedAt: Date,
    },
    brandId: {
      type: String,
      createdAt: Date,
      updatedAt: Date,
    },
    reviewId: {
      type: String,
      createdAt: Date,
      updatedAt: Date,
    },
  },
  { timestamps: true }
);

const Photo = mongoose.model('Photo', imageSchema);

module.exports = Photo;
