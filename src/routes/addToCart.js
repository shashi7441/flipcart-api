const express = require('express');

const cartRoutes = express.Router();

const { addToCartValidation } = require('../middleware/middleware');
const { sellerTokenVarify } = require('../service/adminService');
const { roleCheack } = require('../utility/role');
const {
  addToCart,
  deleteCart,
  incrementAndDecrement,
} = require('../controller/addTOCartController');

const roles = process.env.USER_ROLE;
cartRoutes.post('/cart', sellerTokenVarify, roleCheack(roles), addToCart);

cartRoutes.delete(
  '/cart/:id',
  sellerTokenVarify,
  roleCheack(roles),
  deleteCart
);

cartRoutes.put(
  '/cart/:id',
  sellerTokenVarify,
  roleCheack(roles),
  incrementAndDecrement
);

module.exports = cartRoutes;
