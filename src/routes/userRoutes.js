const express = require('express');
const userRoutes = express.Router();
const { userSignup, userLogin } = require('../controller');
const {
  userSignupValidation,
  userLoginValidation,
  otpVerifyValidation,
} = require('../middleware');
const {
  userVerifiedEmail,
  verifyOtp,
  updatePassword,
} = require('../service/userService');
const { sellerTokenVarify } = require('../service/adminService');
const { multiRoleCheack } = require('../utility/role');
const u1 = 'user';

/**
 * @swagger
 * /api/auth/user/signup:
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
 *              description: ok
 *          404:
 *              description : Bad request
 */

userRoutes.post('/signup', userSignupValidation, userSignup);

// ...........login..................

/**
 * @swagger
 * /api/auth/user/login:
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
 *              description: ok
 *          404:
 *              description : Bad request
 */

userRoutes.post('/login', userLoginValidation, userLogin);

userRoutes.get('/verifytoken/:token', userVerifiedEmail);

// ................... verify otp..................

/**
 * @swagger
 * /api/auth/user/otpVerify:
 *    post:
 *      summary: used to login admin.
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

userRoutes.post('/otpVerify', otpVerifyValidation, verifyOtp);

userRoutes.put(
  '/forgot_password/:id',
  sellerTokenVarify,
  multiRoleCheack(u1),
  updatePassword
);

module.exports = userRoutes;
