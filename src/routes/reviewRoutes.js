const express = require('express');

const reviewRoutes = express.Router();
const {
  addReview,
  deleteReview,
  getAllReview,
  getReviewForUser,
} = require('../controller');
const { multiRoleCheack } = require('../utility/role');
const { fileAndBodyAccept } = require('../utility/multer');
const { sellerTokenVarify } = require('../service/adminService');
const { reviewValidation } = require('../middleware');
const u1 = 'user';
reviewRoutes.post(
  '/review',
  sellerTokenVarify,
  multiRoleCheack(u1),
  reviewValidation,
  addReview
);
reviewRoutes.get('/review/:id', getAllReview);
reviewRoutes.get(
  '/review',
  sellerTokenVarify,
  multiRoleCheack(u1),
  getReviewForUser
);

reviewRoutes.delete(
  '/review/:id',
  sellerTokenVarify,
  multiRoleCheack(u1),
  deleteReview
);

module.exports = reviewRoutes;
