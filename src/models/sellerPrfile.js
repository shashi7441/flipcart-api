const mongoose = require('mongoose');
const sellerProfileSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    adharCardNumber: {
      type: String,
      default: null,
    },
    panCardNumber: String,
    gstNumber: {
      type: String,
    },
    isKyc: {
      type: Boolean,
      default: false,
    },
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);
const Sellerprofile = new mongoose.model('Sellerprofile', sellerProfileSchema);

module.exports = Sellerprofile;
