const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalPrice: {
      type: Number,
    },
    priceWithShippingCharge: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
