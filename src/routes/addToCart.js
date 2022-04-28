const express = require('express');

const cartRoutes = express.Router();

const { addToCartValidation } = require('../middleware');
const { sellerTokenVarify } = require('../service/adminService');
const { multiRoleCheack } = require('../utility/role');
const {
  addToCart,
  allCart,
  incrementAndDecrement,
  deleteOneItemInCart,
  deleteAllItemInCart,
} = require('../controller');

const u1 = 'user';

/**
 * @swagger
 * /api/cart:
 *    post:
 *      summary: used to added new item .
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                required:
 *                   - ProductId
 *                   - quantity
 *                properties:
 *                   ProductId:
 *                      type: string
 *                   quantity:
 *                      type: number
 *      responses:
 *          200:
 *              description: ok
 *          404:
 *              description : bad request
 */
cartRoutes.post(
  '/user/cart',
  sellerTokenVarify,
  multiRoleCheack(u1),
  addToCartValidation,
  addToCart
);

/**
 * /api/cart/:id:
 *  put:
 *      summary: remove from cart
 *      tags: [Cart]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of product you want to remove
 *          - in : query
 *            name: value
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: ok
 *
 *          404:
 *              description : Bad request
 */

cartRoutes.put(
  '/user/cart/:id',
  sellerTokenVarify,
  multiRoleCheack(u1),
  incrementAndDecrement
);

/**
 * /api/cart:
 *  get:
 *      summary: show the all products in cart
 *      tags: [Cart]
 *      responses:
 *          200:
 *              description: ok
 *
 *          404:
 *              description : Bad request
 */

cartRoutes.get('/user/cart', sellerTokenVarify, multiRoleCheack(u1), allCart);

cartRoutes.delete(
  '/user/cart/:id',
  sellerTokenVarify,
  multiRoleCheack(u1),
  deleteOneItemInCart
);

cartRoutes.delete(
  '/user/cart',
  sellerTokenVarify,
  multiRoleCheack(u1),
  deleteAllItemInCart
);

module.exports = cartRoutes;
