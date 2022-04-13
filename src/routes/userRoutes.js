const express = require('express');
const userRoutes = express.Router();
const { userSignup, userLogin } = require('../controller/userController');
const {
  userSignupValidation,
  userLoginValidation,
  otpVerifyValidation,
} = require('../middleware/middleware');
const { userVerifiedEmail, verifyOtp } = require('../service/userService');
const{sellerTokenVarify}= require('../service/adminService')
const{roleCheack}= require('../utility/role')
const{updatePassword}= require('../service/sellerService')
const roles = process.env.USER_ROLE
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
 * /auth/user/api/login:
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
 * /auth/user/api/otpverify:
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
userRoutes.post('/otpverify', otpVerifyValidation, verifyOtp);


userRoutes.put('/forgot_password/:id',sellerTokenVarify,roleCheack(roles),updatePassword)



module.exports = { userRoutes };
