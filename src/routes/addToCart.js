const express = require('express');

const cartRoutes = express.Router();

const { addToCartValidation } = require('../middleware/middleware');
const { sellerTokenVarify } = require('../service/adminService');
const { roleCheack } = require('../utility/role');
const {
  addToCart,
  deleteCart,
  allCart,
  incrementAndDecrement,
  deleteAllCart
} = require('../controller/addTOCartController');

const roles = process.env.USER_ROLE;
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
  roleCheack(roles),
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
  roleCheack(roles),
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
  roleCheack(roles),
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

cartRoutes.get('/cart', sellerTokenVarify, roleCheack(roles), allCart);

cartRoutes.delete('/cart', sellerTokenVarify, roleCheack(roles), deleteAllCart)


module.exports = cartRoutes;
