const express = require('express');

const categoryRoutes = express.Router();
const {
  createCategory,
  showCategory,
  deleteCategory,
  updateCategory,
} = require('../controller/categoryController');
const { categoryValidation } = require('../middleware/middleware');
const {roleCheack} = require('../utility/role')
const {sellerTokenVarify} = require('../service/adminService')
const{fileAndBodyAcceptForSingleImage} = require('../utility/multer')

const roles = process.env.SELLER_ROLE

//....................create category................
/**
 * @swagger
 * /api/category:
 *    post:
 *      summary: used to create  category.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                required:
 *                   - category
 *                   - image
 *                properties:
 *                   brand:
 *                      type: string
 *                   image:
 *                      type: string
 *      responses:
 *          200:
 *              description: category created successfully
 *          404:
 *              description : Bad request
 */

categoryRoutes.post('/category', sellerTokenVarify, roleCheack(roles), fileAndBodyAcceptForSingleImage,categoryValidation, createCategory);
// .......................show category...........................

/**
 * @swagger
 * /api/category:
 *    get:
 *      summary: used to show category.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                required:
 *                   - category
 *                   - image
 *                properties:
 *                   brand:
 *                      type: string
 *                   image:
 *                      type: string
 *      responses:
 *          200:
 *              description: ok
 *          404:
 *              description : Bad request
 */
categoryRoutes.get('/category',sellerTokenVarify, roleCheack(roles), showCategory);
// ............updated category successful............

/**
 * @swagger
 * /api/category/:id:
 *    put:
 *      summary: used to update category.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                required:
 *                   - category
 *                   - image
 *                properties:
 *                   brand:
 *                      type: string
 *                   image:
 *                      type: string
 *      responses:
 *          200:
 *              description: ok
 *          404:
 *              description : Bad request
 */
categoryRoutes.put('/category/:id', sellerTokenVarify, roleCheack(roles),fileAndBodyAcceptForSingleImage,updateCategory);

// ............delete category...........

/**
 * @swagger
 * /api/category/:id:
 *    delete:
 *      summary: used to delete category.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                required:
 *                   - category
 *                   - image
 *                properties:
 *                   brand:
 *                      type: string
 *                   image:
 *                      type: string
 *      responses:
 *          200:
 *              description: ok
 *          404:
 *              description : Bad request
 */
categoryRoutes.delete('/category/:id', sellerTokenVarify, roleCheack(roles), deleteCategory);




module.exports = categoryRoutes;
