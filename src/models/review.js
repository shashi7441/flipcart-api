const mongoose = require('mongoose');
const reviewSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  title:{
    type:String,
    default:null
  },
  comment: {
    type: String,
    default: null,
  },
  rating: {
    type: Number,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
