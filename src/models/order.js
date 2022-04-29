const { number } = require('joi');
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orders: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
        },
      },
    ],
    totalPriceWithShipingCharge: {
      type: Number,
      default: null,
    },
    shippingcharge: {
      type: Number,
      default: null,
    },
    totalPrice: {
      type: Number,
      default: null,
    },
    fastDeliverTime: {
      type: Date,
    },
    totalPriceWithFastDeliveryCharge: {
      type: Number,
    },
    standardDeliveryTime: {
      type: Date,
      default: new Date(+new Date() + 3 * 24 * 60 * 60 * 1000),
    },
    fastDeliveryCharge: {
      type: Number,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
    status: {
      type: String,
      enum: ['ordered', 'cancelled', 'dispatch', 'shipped', 'delivered'],
    },
    paymentMode: {
      type: String,
      enum: ['COD', 'netBanking', 'debitCard', 'creditCard'],
      default: 'COD',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
