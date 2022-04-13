const express = require('express');

const sellerProfileRoutes = express.Router();

const {
  sellerProfileCreate,
  sellerProfileUpdate,
} = require('../controller/sellerProfileController');
const { sellerProfileValidation } = require('../middleware/middleware');
const { sellerTokenVarify } = require('../service/adminService');
const{roleCheack} = require('../utility/role')


const roles = process.env.SELLER_ROLE
sellerProfileRoutes.post(
  '/sellerProfile',
  sellerTokenVarify,
  roleCheack(roles),
  sellerProfileValidation,
  sellerProfileCreate
);

sellerProfileRoutes.put(
  '/sellerProfile/update/:_id',
  sellerTokenVarify,
  roleCheack(roles),
  sellerProfileUpdate
);

module.exports = sellerProfileRoutes;
