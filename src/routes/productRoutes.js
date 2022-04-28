const express = require('express');
require('dotenv').config();
const productRoutes = express.Router();

const {
  createProduct,
  updateProducts,
  getAllProductsForPublic,
  deleteProducts,
  isApproved,
  getAllProduct,
  showOneProductForPublic,
} = require('../controller');
const { productValidation } = require('../middleware');
const { sellerTokenVarify } = require('../service/adminService');
const { multiRoleCheack } = require('../utility/role');
const { fileAndBodyAccept } = require('../utility/multer');
const { cheackBrandCategory } = require('../service/productService.js');

const s1 = 'seller';
const a1 = 'admin';
const u1 = 'user';
//..................create Product...........

/**
 * @swagger
 * components:
 *      schemas:
 *          product:
 *              type: object
 *              required :
 *                  - title
 *                  - price
 *                  - categoryId
 *                  - brandId
 *                  - services
 *              properties:
 *                  title :
 *                      type : string
 *                  price :
 *                      type : number
 *                  categoryId :
 *                      type : string
 *                  brandId :
 *                      type : string
 *                  services :
 *                      type : string
 *                  image :
 *                      type: string
 *                      format: binary
 */

/**
 * @swagger
 * tags:
 *  name: Products
 *  description: the products api
 */

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: add new product
 *     tags: [Products]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/product'
 *     responses:
 *          200:
 *              description: Ok
 *
 *          404:
 *              description : Bad request
 */

productRoutes.post(
  '/product',
  sellerTokenVarify,
  multiRoleCheack(s1),
  fileAndBodyAccept,
  productValidation,
  cheackBrandCategory,
  createProduct
);

// .................In product get api..............................
/**
 * /api/product:
 *  get:
 *      summary: remove from cart
 *      tags: [Products]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of product you want to remove
 *          - in : query
 *            name: fields
 *            schema:
 *              type: string
 *            name : filter
 *             type: object
 *      responses:
 *          200:
 *              description: ok
 *
 *          404:
 *              description : Bad request
 */

// ........................In product update api.....................
/**
 * @swagger
 * components:
 *      schemas:
 *          product:
 *              type: object
 *              required :
 *                  - title
 *                  - price
 *                  - categoryId
 *                  - brandId
 *                  - services
 *              properties:
 *                  title :
 *                      type : string
 *                  price :
 *                      type : number
 *                  categoryId :
 *                      type : string
 *                  brandId :
 *                      type : string
 *                  services :
 *                      type : string
 *                  image :
 *                      type: string
 *                      format: binary
 */

/**
 * @swagger
 * tags:
 *  name: Products
 *  description: the products api
 */

/**
 * @swagger
 * /api/product/:id:
 *   put:
 *     summary: add new product
 *     tags: [Products]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/product'
 *     responses:
 *          200:
 *              description: Ok
 *
 *          404:
 *              description : Bad request
 */

productRoutes.put(
  '/product/:id',
  sellerTokenVarify,
  multiRoleCheack(s1),
  fileAndBodyAccept,
  updateProducts
);

// .......................In product delete api...........................
/**
 * @swagger
 * /api/product/:id:
 *  delete:
 *      summary: delete product
 *      tags: [Products]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of product you want to see
 *      responses:
 *          200:
 *              description: ok
 *
 *          404:
 *              description : Bad request
 */
productRoutes.delete(
  '/product/:id',
  sellerTokenVarify,
  multiRoleCheack(s1),
  deleteProducts
);
//  ............................in Product api get one product..................
/**
 * @swagger
 * /api/product/:id:
 *  get:
 *      summary: one product data found
 *      tags: [Products]
 *      parameters:
 *          - in : path
 *            name: id
 *            schema:
 *              type: string
 *              description: enter the id of product you want to see
 *      responses:
 *          200:
 *              description: ok
 *
 *          404:
 *              description : Bad request
 */

productRoutes.get('/product/:id', showOneProductForPublic);

productRoutes.get(
  '/product',
  sellerTokenVarify,
  multiRoleCheack(a1, s1, u1),
  getAllProduct
);

productRoutes.get('/product', getAllProductsForPublic);

productRoutes.patch(
  '/product/:id',
  sellerTokenVarify,
  multiRoleCheack(a1),
  isApproved
);

module.exports = productRoutes;
