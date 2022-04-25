const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    deliverTime: { type: Date },
    price: Number,
    highlight: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    services: {
      type: String,
      default: null,
    },
    quantity: {
      type: Number,
    },
    availableOffer: {
      type: String,
      default: null,
    },

    color: {
      type: String,
      default: null,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: 'Photo',
    },
    rating: Number,
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },

    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    paymentMode: {
      type: String,
      default: 'COD',
    },
    isApprovedbyAdmin: {
      type: Boolean,
      default: false,
    },
    size: Number,
    availableOffers: String,
  },

  { timestamps: true }
);

const Product = new mongoose.model('Product', productSchema);

module.exports = Product;
