const express = require('express');

const orderRoutes = express.Router();
const {
  order,
  cancelOrder,
  showOneOrder,
  stateChange,
  deliverProduct,
  changeDate,
} = require('../controller');
const { orderValidation } = require('../middleware');
const { sellerTokenVarify } = require('../service/adminService');
const { multiRoleCheack } = require('../utility/role');
const a1 = 'admin';
const s1 = 'seller';
const u1 = 'user';
orderRoutes.post(
  '/order',
  sellerTokenVarify,
  multiRoleCheack(u1),
  orderValidation,
  order
);
orderRoutes.put(
  '/order/:id',
  sellerTokenVarify,
  multiRoleCheack(s1),
  stateChange
);

orderRoutes.delete(
  '/order/:id',
  sellerTokenVarify,
  multiRoleCheack(u1),
  cancelOrder
);

orderRoutes.get(
  '/order/:id',
  sellerTokenVarify,
  multiRoleCheack(u1),
  showOneOrder
);
orderRoutes.patch(
  '/order/deliver/:id',
  sellerTokenVarify,
  multiRoleCheack(a1),
  deliverProduct
);

orderRoutes.patch(
  '/order/:date',
  sellerTokenVarify,
  multiRoleCheack(u1),
  changeDate
);

module.exports = orderRoutes;
