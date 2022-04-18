const { number } = require('joi');
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: Number,
    deliverTime: {
      type: Date,
      default: new Date(+new Date() + 5 * 24 * 60 * 60 * 1000),
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
    status: {
      type: String,
      enum: ['ordered', 'cancelled', 'shipped', 'delivered'],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
