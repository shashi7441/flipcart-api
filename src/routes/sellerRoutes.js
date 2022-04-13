const express = require('express');
require('dotenv').config()
const sellerRoutes = express.Router();
const { signup, login } = require('../controller/sellerController');
const { verifiedEmail, verifyOtp } = require('../service/sellerService');
const {
  sellerSignupValidation,
  sellerLoginValidation,
  otpVerifyValidation,
} = require('../middleware/middleware');
const{updatePassword} = require('../service/sellerService')
const{sellerTokenVarify} = require('../service/adminService')
const{roleCheack} = require('../utility/role')
const roles = process.env.SELLER_ROLE
// ............ seller signup ................
/**
 * @swagger
 * /api/auth/seller/signup:
 *    post:
 *      summary: used to signup and login admin.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                required:
 *                   - fullName
 *                   - phone
 *                   - email
 *                   - password
 *                properties:
 *                   fullName:
 *                      type: string
 *                   email:
 *                      type: string
 *                   phone:
 *                      type: string
 *                   password:
 *                      type: string
 *      responses:
 *          200:
 *              description: this is the list of seller
 *          404:
 *              description : seller doesnt found
 */
sellerRoutes.post('/signup', sellerSignupValidation, signup);
//  .......................verified email............
/**
 * @swagger
 * /api/auth/seller/verifytoken/:token:
 *   get:
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         description: Numeric ID of the user to get
 */
sellerRoutes.get('/verifytoken/:token', verifiedEmail);
// ................ seller login...............
/**
 * @swagger
 * /api/auth/seller/login:
 *    post:
 *      summary: used to login admin.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                required:
 *                   - phone
 *                   - email
 *                   - password
 *                properties:
 *                   email:
 *                      type: string
 *                   phone:
 *                      type: string
 *                   password:
 *                      type: string
 *      responses:
 *          200:
 *              description: this is the list of seller
 *          404:
 *              description : seller doesnt found
 */
sellerRoutes.post('/login', sellerLoginValidation, login);

// .......................working continue............!!!!!!!!!!!!!!!!!!!!!!!!1

sellerRoutes.put('/forgot_password/:id',sellerTokenVarify,roleCheack(roles),updatePassword)
//  ................otp verify..................
/**
 * @swagger
 * /api/auth/seller/verifyotp:
 *    post:
 *      summary: used to otp verification.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                required:
 *                   - phone
 *                   - otp
 *                properties:
 *                   phone:
 *                      type: string
 *                   otp:
 *                      type: string
 *      responses:
 *          200:
 *              description: ok
 *          404:
 *              description : Bad request
 */
sellerRoutes.post('/verifyotp', otpVerifyValidation, verifyOtp);

module.exports = { sellerRoutes };
