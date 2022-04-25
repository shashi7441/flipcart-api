const Photo = require('../models/image');
require('dotenv').config();
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.createReviewPhoto = async (req, res) => {
  const create = await Photo({
    image: req.images,
    reviewId: req.reviewId,
  });
  const result = await create.save();

  req.results = result;
};

exports.deleteReviewPhoto = async (req, res) => {
  try {
    const testId = req.deleteImageId;
    let user = await Photo.findOne({ _id: testId });
    const data = user.image;
    data.map(async (i) => {
      await cloudinary.uploader.destroy(i.public_id);
    });

    user.remove();
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};
