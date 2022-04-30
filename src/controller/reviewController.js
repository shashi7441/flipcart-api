const Review = require('../models/review');
const Product = require('../models/product');
const { Apierror } = require('../utility/error');
require('dotenv').config();
// return next(new Apierror('no product found', 400));

exports.addReview = async (req, res) => {
  try {
    const { productId, comment, rating, title } = req.body;
    const reviewFound = await Review.findOne({
      productId: productId,
      userId: req.id,
    }).populate('userId', 'fullName');
    const productData = await Product.findOne({ _id: productId });
    if (!productData) {
      return next(new Apierror('product not found', 400));
    }

    if (Object.entries(req.body).length == 0) {
      return next(new Apierror(' please fill the field', 400));
    }
    if (reviewFound) {
      return next(new Apierror('already commented', 400));
    } else {
      const createComment = await Review({
        productId,
        comment,
        rating,
        title,
        userId: req.id,
      });
      const result = await createComment.save();
      return res.json({
        statusCode: 200,
        message: 'comment added successfully',
        data: result,
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.getAllReview = async (req, res) => {
  try {
    const _id = req.params.id;
    const reviewData = await Review.find({ productId: _id })
      .populate('productId', 'price title services  ')
      .populate('userId', 'fullName');
    let sum = 0;
    for (i of reviewData) {
      sum += i.rating;
    }
    const average = sum / reviewData.length;

    if (!reviewData) {
      return res.json({
        statusCode: 400,
        message: 'Data not found',
      });
    } else {
      return res.json({
        statusCode: 200,
        averageRating: average,
        data: reviewData,
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.getReviewForUser = async (req, res) => {
  try {
    const reviewData = await Review.find({ userId: req.id })
      .populate('productId', 'price title services  ')
      .populate('userId', 'fullName');
    if (!reviewData) {
      return res.json({
        statusCode: 400,
        message: 'data not found',
      });
    } else {
      return res.json({
        statusCode: 200,
        data: reviewData,
      });
    }
  } catch (e) {
    return res.josn({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const reviewData = await Review.findOne({ _id: _id });
    if (!reviewData) {
      return next(new Apierror('data not found', 400));
    } else {
      const deleteReview = await Review.findOneAndDelete({ _id: _id });
      return res.json({
        statusCode: 200,
        message: 'comment delete succusfully',
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const { productId, comment, rating, title } = req.body;

    const reviewData = await Review.findOne({ _id: _id });
    if (Object.entries(req.body).length == 0) {
      return next(new Apierror(' please fill the field', 400));
    }
    if (!reviewData) {
      return next(new Apierror('data not found', 400));
    }

    const updateReview = await Review.findOneAndUpdate(
      { _id: _id },
      { productId: productId, comment: comment, rating: rating, title: title },
      { new: true }
    );
    return res.json({
      statusCode: 200,
      message: 'updated successfully',
      data: updateReview,
    });
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};
