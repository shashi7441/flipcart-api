const Photo = require('../models/image');
const cloudinary = require('cloudinary');
const e = require('express');
exports.createPhoto = async (req, res) => {
  const create = await Photo({
    image: req.images,
    productId: req.productId,
  });
  const result = await create.save();

  req.results = result;
};

exports.createAndUpdatePhoto = async (req, res) => {
  const create = await Photo({
    image: req.images,
    productId: req.product_Id,
  });
  const result = await create.save();
  req.photo_id = result._id;
};

exports.deletePhoto = async (req, res) => {
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
      success: false,
      message: e.message,
    });
  }
};

exports.updatePhoto = async (req, res) => {
  try {
    const id = req.updateImageId;
    const data = await Photo.findOne({ _id: id });

    const dataImage = data.image;
    dataImage.map(async (i) => {
      await cloudinary.uploader.destroy(i.public_id);
    });

    const urls = [];
    for (let file of req.files) {
      const { path } = file;
      await cloudinary.uploader.upload(`${path}`, (result, e) => {
        const { url, public_id } = result;
        const newPush = {};

        newPush.url = url;
        newPush.public_id = public_id;
        urls.push(newPush);
        req.urls = urls;
      });
      const updateImage = await Photo.updateOne(
        { _id: id },
        {
          image: req.urls,
        }
      );
    }
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.updatePhotoAndBody = async (req, res) => {
  try {
    const id = req.updateImageId;
    const data = await Photo.findOne({ _id: id });

    const dataImage = data.image;
    dataImage.map(async (i) => {
      await cloudinary.uploader.destroy(i.public_id);
    });
    const urls = [];
    for (let file of req.files) {
      const { path } = file;
      await cloudinary.uploader.upload(`${path}`, (result, e) => {
        const { url, public_id } = result;
        const newPush = {};

        newPush.url = url;
        newPush.public_id = public_id;
        urls.push(newPush);
        req.urls = urls;
      });
      const updateImage = await Photo.updateOne(
        { _id: id },
        {
          image: req.urls,
        }
      );
    }
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.showImage = async (req, res) => {
  const result = await Photo.find();
  return res.json({
    success: true,
    data: result,
  });
};
