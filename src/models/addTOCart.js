const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    ProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      default: 0,
    },
  },
  { timeStamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
