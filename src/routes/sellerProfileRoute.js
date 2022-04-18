const express = require('express');

const sellerProfileRoutes = express.Router();

const {
  sellerProfileCreate,
  sellerProfileUpdate,
} = require('../controller/sellerProfileController');
const { sellerProfileValidation } = require('../middleware/middleware');
const { sellerTokenVarify } = require('../service/adminService');
const { roleCheack } = require('../utility/role');
const roles = process.env.SELLER_ROLE;

/**
 * @swagger
 * /api/seller/sellerProfile:
 *    post:
 *      summary: used to create seller Profile.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                required:
 *                   - sellerId
 *                   - adharCardNumber
 *                   - panCardNumber
 *                   - gstNumber
 *                properties:
 *                   sellerId:
 *                      type: string
 *                   adharCardNumber:
 *                      type: string
 *                   panCardNumber:
 *                      type: string
 *                   gstNumber:
 *                      type: string
 *      responses:
 *          200:
 *              description: ok
 *          404:
 *              description : bad request
 */

sellerProfileRoutes.post(
  '/sellerProfile',
  sellerTokenVarify,
  roleCheack(roles),
  sellerProfileValidation,
  sellerProfileCreate
);

sellerProfileRoutes.get('/sellerProfile', sellerTokenVarify, roleCheack(roles))


/**
 * @swagger
 * /api/seller/sellerProfile/:id:
 *    put:
 *      summary: used to update sellerProfile .
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                required:
 *                   - sellerId
 *                   - adharCardNumber
 *                   - panCardNumber
 *                   - gstNumber
 *                properties:
 *                   sellerId:
 *                      type: string
 *                   adharCardNumber:
 *                      type: string
 *                   panCardNumber:
 *                      type: string
 *                   gstNumber:
 *                      type: string
 *      responses:
 *          200:
 *              description: ok
 *          404:
 *              description : bad request
 */

sellerProfileRoutes.put(
  '/sellerProfile/:id',
  sellerTokenVarify,
  roleCheack(roles),
  sellerProfileUpdate
);
module.exports = sellerProfileRoutes;
