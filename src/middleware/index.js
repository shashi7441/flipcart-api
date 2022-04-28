const { addToCartValidation } = require('../middleware/addToCart');
const { adressValidation } = require('../middleware/address');
const { adminSignupValidation } = require('../middleware/admin');

const { brandValidation } = require('../middleware/brand');
const { categoryValidation } = require('../middleware/category');
const { orderValidation } = require('../middleware/orderMiddleware');
const { productValidation } = require('../middleware/product');
const { reviewValidation } = require('../middleware/reviewMiddleware');
const {
  sellerLoginValidation,
  sellerProfileValidation,
  sellerSignupValidation,
} = require('../middleware/seller');

const {
  userLoginValidation,
  userSignupValidation,
  otpVerifyValidation,
} = require('../middleware/userMiddleware');

module.exports = {
  addToCartValidation,
  adminSignupValidation,
  adressValidation,
  userLoginValidation,
  userSignupValidation,
  brandValidation,
  categoryValidation,
  orderValidation,
  productValidation,
  otpVerifyValidation,
  reviewValidation,
  sellerLoginValidation,
  sellerProfileValidation,
  sellerSignupValidation,
};
