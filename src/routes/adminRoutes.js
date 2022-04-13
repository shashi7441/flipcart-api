const express = require('express');
require('dotenv').config();
const adminRoutes = express.Router();
const {
  adminSignup,
  signupejs,
  getAllSeller,
dashBoardejs
} = require('../controller/adminController');
const { TokenVarify, adminAprovel } = require('../service/adminService');
const { adminSignupValidation } = require('../middleware/middleware');
const { roleCheack } = require('../utility/role');



//adminRoutes in signup
/**
 * @swagger
 * /api/auth/admin/signup:
 *    post:
 *      summary: used to signup and login admin.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                required:
 *                   - fullName
 *                   - email
 *                   - password
 *                properties:
 *                   fullName:
 *                      type: string
 *                   email:
 *                      type: string
 *                   password:
 *                      type: string
 *      responses:
 *          200:
 *              description: this is the list of seller
 *          404:
 *              description : seller doesnt found
 */

adminRoutes.post('/signup', adminSignupValidation, adminSignup);
adminRoutes.get('/signup', signupejs);
adminRoutes.get('/dashBoard', dashBoardejs)

//...................adminRoutes post api...........................
/**
 * @swagger
 * /api/auth/admin/aprovel:
 *    post:
 *      summary: used to token verify and admin approvel.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                required:
 *                   -_id
 *                properties:
 *                    _id:
 *                      type: string
 *      responses:
 *          200:
 *              description: this is seller approvel
 *          404:
 *              description : seller doesnt found
 */
const roles = process.env.ADMIN_ROLE;
adminRoutes.post('/aprovel', TokenVarify, roleCheack(roles), adminAprovel);

// ...............admin get api in swagger.....................
/**
 * @swagger
 * /api/auth/admin/allSeller:
 *   get:
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to get
 */
adminRoutes.get('/allSeller', TokenVarify, roleCheack(roles) , getAllSeller);
module.exports = adminRoutes;
