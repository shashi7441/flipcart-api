const express = require('express');
require('dotenv').config()
const addressRoutes = express.Router();
const { roleCheack } = require('../utility/role');

const {
  createAddress,
  getAddress,
  updateAddress,
  deleteData,
  showAllState,
} = require('../controller/addressController');
const { adressValidation } = require('../middleware/middleware');
const { sellerTokenVarify } = require('../service/adminService');
const roles = process.env.USER_ROLE

addressRoutes.post('/address', sellerTokenVarify, roleCheack(roles), adressValidation, createAddress);
addressRoutes.get('/address', sellerTokenVarify,roleCheack(roles), getAddress);
addressRoutes.get('/address/country', sellerTokenVarify, roleCheack(roles), showAllState);
addressRoutes.put('/address/:id',sellerTokenVarify,roleCheack(roles) ,updateAddress);
addressRoutes.delete('/address/:id',sellerTokenVarify, roleCheack(roles), deleteData);

module.exports = addressRoutes;
