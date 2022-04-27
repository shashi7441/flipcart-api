const Review = require('../models/review');
const Product = require('../models/product');
require('dotenv').config();

exports.addReview = async (req, res) => {
  try {
    const { productId, comment, rating, title } = req.body;
    const reviewFound = await Review.findOne({
      productId: productId,
      userId: req.id,
    }).populate('userId', 'fullName');
    const productData = await Product.findOne({ _id: productId });
    if (!productData) {
      return res.json({
        success: false,
        statusCode: 400,
        message: 'product not found',
      });
    }

    if (Object.entries(req.body).length == 0) {
      return res.json({
        statusCode: 400,
        message: ' please fill the field',
      });
    }
    if (reviewFound) {
      return res.json({
        statusCode: 400,
        message: 'already commented',
      });
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

exports.deleteReview = async (req, res) => {
  try {
    const _id = req.params.id;
    const reviewData = await Review.findOne({ _id: _id });
    if (!reviewData) {
      return res.json({
        statusCode: 400,
        message: 'data not found',
      });
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

exports.updateReview = async (req, res) => {
  try {
    const _id = req.params.id;
    const { productId, comment, rating, title } = req.body;

    const reviewData = await Review.findOne({ _id: _id });
    if (Object.entries(req.body).length == 0) {
      return res.json({
        statusCode: 400,
        message: ' please fill the field',
      });
    }
    if (!reviewData) {
      return res.josn({
        statusCode: 400,
        message: 'data not found',
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};
