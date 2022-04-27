const express = require('express');

const categoryRoutes = express.Router();
const {
  createCategory,
  showCategory,
  deleteCategory,
  updateCategory,
} = require('../controller/categoryController');
const { categoryValidation } = require('../middleware/category');
const { multiRoleCheack } = require('../utility/role');
const { sellerTokenVarify } = require('../service/adminService');
const { fileAndBodyAccept } = require('../utility/multer');
const s1 = 'seller';
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

categoryRoutes.post(
  '/category',
  sellerTokenVarify,
  multiRoleCheack(s1),
  fileAndBodyAccept,
  categoryValidation,
  createCategory
);
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
categoryRoutes.get(
  '/category',
  sellerTokenVarify,
  multiRoleCheack(s1),
  showCategory
);
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
categoryRoutes.put(
  '/category/:id',
  sellerTokenVarify,
  multiRoleCheack(s1),
  fileAndBodyAccept,
  updateCategory
);

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
categoryRoutes.delete(
  '/category/:id',
  sellerTokenVarify,
  multiRoleCheack(s1),
  deleteCategory
);

module.exports = categoryRoutes;
