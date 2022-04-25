const express = require('express');

const cartRoutes = express.Router();

const { addToCartValidation } = require('../middleware/middleware');
const { sellerTokenVarify } = require('../service/adminService');
const { multiRoleCheack } = require('../utility/role');
const {
  addToCart,
  deleteCart,
  allCart,
  incrementAndDecrement,
  deleteAllCart
} = require('../controller/addTOCartController');

const u1 = "user";

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
  '/cart',
  sellerTokenVarify,
  multiRoleCheack(u1),
  addToCartValidation,
  addToCart
);
/**
 * /api/cart/:id:
 *  delete:
 *      summary: remove from cart
 *      tags: [Cart]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of product you want to remove
 *      responses:
 *          200:
 *              description: product deleted successfull
 *
 *          404:
 *              description : data doesnt found
 */

cartRoutes.delete(
  '/cart/:id',
  sellerTokenVarify,
  multiRoleCheack(u1),
  deleteCart
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
  '/cart/:id',
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

cartRoutes.get('/cart', sellerTokenVarify, multiRoleCheack(u1), allCart);

cartRoutes.delete('/cart', sellerTokenVarify, multiRoleCheack(u1), deleteAllCart)


module.exports = cartRoutes;
