const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { date } = require('joi');
const addressSchema = new mongoose.Schema(
  {
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    country: String,
    state: String,
    city: String,
    streat: String,
    pincode: Number,
    landMark: String,
    houseNo: String,
    addressType: String,
    isActive: {
      type: Boolean,
      default: false,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
