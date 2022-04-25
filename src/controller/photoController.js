const Photo = require('../models/image');
const cloudinary = require('cloudinary');
const e = require('express');
exports.createPhoto = async (req, res) => {
  // console.log('req in controller 22222222 2222 ' , req.images);
  // console.log('createPhoto', req.productId);
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
    // console.log(user);
    const data = user.image;
    // console.log( data);

    data.map(async (i) => {
      console.log('in id', i.public_id);
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
    console.log('in update photo', data);
    const dataImage = data.image;
    dataImage.map(async (i) => {
      await cloudinary.uploader.destroy(i.public_id);
      // console.log(i.public_id);
    });
    console.log('>????????????????????', req.files);
    const urls = [];
    for (let file of req.files) {
      const { path } = file;
      await cloudinary.uploader.upload(`${path}`, (result, e) => {
        // console.log("errrrr", e);
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>.",result);
        const { url, public_id } = result;
        const newPush = {};
        // console.log('result', result);
        newPush.url = url;
        newPush.public_id = public_id;
        urls.push(newPush);
        req.urls = urls;
        // console.log(url);
      });
      const updateImage = await Photo.updateOne(
        { _id: id },
        {
          image: req.urls,
        }
      );
    }
  } catch (e) {
  return  res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.updatePhotoAndBody = async (req, res) => {
  try {
    const id = req.updateImageId;
    const data = await Photo.findOne({ _id: id });
    console.log('in update photo', data);

    const dataImage = data.image;
    dataImage.map(async (i) => {
      await cloudinary.uploader.destroy(i.public_id);
    });
    const urls = [];
    for (let file of req.files) {
      const { path } = file;
      await cloudinary.uploader.upload(`${path}`, (result, e) => {
        // console.log("errrrr", e);
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>.",result);
        const { url, public_id } = result;
        const newPush = {};
        // console.log('result', result);
        newPush.url = url;
        newPush.public_id = public_id;
        urls.push(newPush);
        req.urls = urls;
        // console.log(url);
      });
      const updateImage = await Photo.updateOne(
        { _id: id },
        {
          image: req.urls,
        }
      );
    }
  } catch (e) {
   return  res.json({
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
