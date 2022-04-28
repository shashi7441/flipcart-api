const express = require('express');

const sellerProfileRoutes = express.Router();

const { sellerProfileCreate, sellerProfileUpdate } = require('../controller');
const { sellerProfileValidation } = require('../middleware');
const { sellerTokenVarify } = require('../service/adminService');
const { multiRoleCheack } = require('../utility/role');
const s1 = 'seller';

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
  multiRoleCheack(s1),
  sellerProfileValidation,
  sellerProfileCreate
);

sellerProfileRoutes.get(
  '/sellerProfile',
  sellerTokenVarify,
  multiRoleCheack(s1)
);

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
  multiRoleCheack(s1),
  sellerProfileUpdate
);
module.exports = sellerProfileRoutes;
