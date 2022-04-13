const express = require('express');
require('dotenv').config();
const productRoutes = express.Router();

const {
  createProduct,
  getAllProducts,
  updateProducts,
  deleteProducts,
  showOneProduct,
  redis_product,
} = require('../controller/productController.js');
const {
  productValidation,
  productUpdateValidation,
} = require('../middleware/middleware');
const { sellerTokenVarify } = require('../service/adminService');
const { roleCheack } = require('../utility/role');
const { uploadImg, fileAndBodyAccept } = require('../utility/multer');
const { cheackBrandCategory } = require('../service/productService.js');

const roles = process.env.SELLER_ROLE;

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
  roleCheack(roles),
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

productRoutes.get(
  '/product',
  sellerTokenVarify,
  roleCheack(roles),
  getAllProducts
);

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
  roleCheack(roles),
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
  roleCheack(roles),
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

productRoutes.get(
  '/product/:id',
  sellerTokenVarify,
  roleCheack(roles),
  showOneProduct
);

module.exports = productRoutes;
