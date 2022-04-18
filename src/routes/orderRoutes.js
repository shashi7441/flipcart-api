const express = require('express');

const orderRoutes = express.Router();
const {
  order,
  cancelOrder,
  showOneOrder,
  showAllOrder,
  stateChange,
} = require('../controller/orderController');
const { orderValidation } = require('../middleware/orderMiddleware');
const { sellerTokenVarify } = require('../service/adminService');
const { roleCheack, multiRoleCheack } = require('../utility/role');
const roles = process.env.USER_ROLE;
const a1 = 'admin';
orderRoutes.post(
  '/order',
  sellerTokenVarify,
  roleCheack(roles),
  orderValidation,
  order
);
orderRoutes.put(
  '/order/:id',
  sellerTokenVarify,
  multiRoleCheack(a1),
  stateChange
);
orderRoutes.delete(
  '/order/:id',
  sellerTokenVarify,
  roleCheack(roles),
  cancelOrder
);
orderRoutes.get(
  '/order/:id',
  sellerTokenVarify,
  roleCheack(roles),
  showOneOrder
);
orderRoutes.get('/order', sellerTokenVarify,roleCheack(roles), showAllOrder);

module.exports = orderRoutes;
