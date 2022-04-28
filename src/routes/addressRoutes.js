const express = require('express');
require('dotenv').config();
const addressRoutes = express.Router();
const { multiRoleCheack } = require('../utility/role');
const {
  createAddress,
  getAddress,
  updateAddress,
  deleteData,
  showAllState,
} = require('../controller');
const { adressValidation } = require('../middleware');
const { sellerTokenVarify } = require('../service/adminService');
const u1 = 'user';
const s1 = 'seller';

addressRoutes.post(
  '/address',
  sellerTokenVarify,
  multiRoleCheack(u1),
  adressValidation,
  createAddress
);
addressRoutes.get(
  '/address',
  sellerTokenVarify,
  multiRoleCheack(u1),
  getAddress
);
addressRoutes.get(
  '/address/country',
  sellerTokenVarify,
  multiRoleCheack(u1),
  showAllState
);
addressRoutes.put(
  '/address/:id',
  sellerTokenVarify,
  multiRoleCheack(u1),
  updateAddress
);
addressRoutes.delete(
  '/address/:id',
  sellerTokenVarify,
  multiRoleCheack(u1),
  deleteData
);

module.exports = addressRoutes;
