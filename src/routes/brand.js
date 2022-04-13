const express = require('express');

const brandRoutes = express.Router();

const {
  createBrand,
  showBrand,
  updateBrand,
  deleteBrand,
} = require('../controller/brandController');
const { brandValidation } = require('../middleware/middleware');
const { sellerTokenVarify } = require('../service/adminService');
const { fileAndBodyAcceptForSingleImage } = require('../utility/multer');
const { roleCheack } = require('../utility/role');
const roles = process.env.SELLER_ROLE;

//........................create Brand..................
/**
 * @swagger
 * components:
 *      schemas:
 *          product:
 *              type: object
 *              required :
 *                  - brand
 *                  - image
 *              properties:
 *                  brand :
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
 * /api/brand:
 *   post:
 *     summary: add new brand
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

brandRoutes.post(
  '/brand',
  sellerTokenVarify,
  roleCheack(roles),
  fileAndBodyAcceptForSingleImage,
  brandValidation,
  createBrand
);

// .................... show Brand....................
/**
 * @swagger
 * /api/brand/:id:
 *  get:
 *      summary: show brand
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

brandRoutes.get('/brand', sellerTokenVarify, roleCheack(roles), showBrand);

// .................update Brand.....................
/**
 * @swagger
 * components:
 *      schemas:
 *          product:
 *              type: object
 *              required :
 *                  - brand
 *                  - image
 *              properties:
 *                  brand :
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
 * /api/brand/:id:
 *   put:
 *     summary: update brand
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

brandRoutes.put(
  '/brand/:id',
  sellerTokenVarify,
  roleCheack(roles),
  fileAndBodyAcceptForSingleImage,
  updateBrand
);

// ...................delete brand......................

/**
 * @swagger
 * /api/brand/:id:
 *  delete:
 *      summary: delete brand
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

brandRoutes.delete(
  '/brand/:id',
  sellerTokenVarify,
  roleCheack(roles),
  deleteBrand
);

module.exports = brandRoutes;
