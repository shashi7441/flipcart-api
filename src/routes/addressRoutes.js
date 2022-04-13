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
const { userTokenVarify } = require('../service/userService');
const roles = process.env.USER_ROLE
addressRoutes.post('/create', userTokenVarify, roleCheack(roles), adressValidation, createAddress);
addressRoutes.post('/get', userTokenVarify,roleCheack(roles), getAddress);
addressRoutes.get('/country', userTokenVarify, roleCheack(roles), showAllState);
addressRoutes.patch('/update/:_id', userTokenVarify,roleCheack(roles) ,updateAddress);
addressRoutes.delete('/delete/:_id',userTokenVarify, roleCheack(roles), deleteData);

module.exports = addressRoutes;
