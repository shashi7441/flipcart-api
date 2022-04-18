const Brand = require('../models/brand');
require('dotenv').config();
const { uploadSingleImage } = require('../utility/multer');
const {
  createAndUpdateBrandPhoto,
  createBrandPhoto,
  updateBrandPhoto,
  deleteBrandPhoto,
} = require('../service/brandServices');
const Photo = require('../models/image');

const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// .........................................under Construction.............................
// ..............old code in  shared..........................
exports.updateBrand = async (req, res) => {
  try {
    console.log('111111111111111111111');
    const { brand, image } = req.body;
    const _id = req.params.id;
    const data = await Brand.findOne({ _id, isActive: true });
    req.brand_Id = data._id;
    if (Object.entries(req.body).length == 0) {
      res.json({
        succes: false,
        message: 'please fill the field',
      });
    }

    if (data) {
      req.updateImageId = data.image;
      console.log(req.files);
      if (req.files) {
        const newResult = await Photo.findOne({ brandId: req.brand_Id });
        console.log('newresult', newResult);
        if (newResult) {
          const result = await Brand.findOneAndUpdate(
            { _id: _id },
            { image },
            { new: true }
          );
          await updateBrandPhoto(req, res);
        } else {
          await uploadSingleImage(req, res);
          await createAndUpdateBrandPhoto(req, res);
          const newData = await Brand.findOneAndUpdate(
            { _id: _id },
            { image: req.photo_id },
            { new: true }
          );
        }
      }
      if (req.body) {
        if (req.files) {
          if (req.files.length > 0) {
            const newResult = await Photo.findOne({
              brandId: req.brand_Id,
            });
            if (newResult) {
              const result = await Brand.findOneAndUpdate(
                { _id: _id },
                { image },
                { new: true }
              );
              // await updatePhoto(req, res);
              await updateBrandPhoto(req, res);
            } else {
              // ...............................working..........................
              await uploadSingleImage(req, res);
              await createAndUpdateBrandPhoto(req, res);
              // await uploadImges(req, res);
              // await createAndUpdatePhoto(req, res);
              const newData = await Brand.findOneAndUpdate(
                { _id: _id },
                { image: req.photo_id },
                { new: true }
              );
            }
          }
        }
        if (req.body) {
          const { brand } = req.body;
          const result = await Brand.findOneAndUpdate(
            { _id: _id },
            {
              brand,
            },
            { new: true }
          );
          const brandFind = await Brand.findOne({
            brand: req.body.brand,
          })
            .populate('image', 'image.url')
            .populate('createdBy', 'fullName');
          return res.json({
            success: true,
            message: 'updated successfully',
            data: brandFind,
          });
        }
      }
    } else {
      res.json({
        succes: false,
        message: ' brand not found',
      });
    }
  } catch (e) {
    res.json({
      succes: false,
      data: e.message,
    });
  }
};

exports.createBrand = async (req, res) => {
  const { brand, image } = req.body;
  console.log('>>>>>>>>>>>>>>', req.files);
  try {
    const findData = await Brand.findOne({
      brand: req.body.brand,
    });

    if (!findData) {
      if (!req.files.length == 0) {
        console.log('00000000000000000000');
        await uploadSingleImage(req, res);
        await createBrandPhoto(req, res);
      }
    }
    console.log('req.body', req.body);

    if (req.body) {
      console.log('11111111111111111111111111');
      if (!req.results) {
        console.log('22222222222222222222222222222');
        const findData = await Brand.findOne({
          brand: req.body.brand,
        });
        if (!findData) {
          const createDocument = await Brand({
            brand,
            createdBy: req.id,
          });
          const result = await createDocument.save();
          res.json({
            success: true,
            message: 'brand created successful',
            data: result,
          });
        } else {
          res.json({
            success: false,
            message: 'already exists',
          });
        }
      } else {
        console.log('33333333333333333333333333333333');
        const findData = await Brand.findOne({
          brand: req.body.brand,
        });
        if (!findData) {
          const createDocument = await Brand({
            brand,
            createdBy: req.id,
            image: req.results._id,
          });
          const result = await createDocument.save();
          const brandFind = await Brand.findOne({
            brand: req.body.brand,
          })
            .populate('image', 'image.url')
            .populate('createdBy', 'fullName');
          req.results.brandId = result._id;
          req.results.save();
          res.json({
            success: true,
            message: 'brand created successful',
            data: brandFind,
          });
        } else {
          res.json({
            success: false,
            message: 'already exists',
          });
        }
      }
    }
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      data: e.message,
    });
  }
};

exports.showBrand = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const search = req.query.search;
    const regex = new RegExp(search, 'i');
    const result = await Brand.find(
      { createdBy: req.id },
      { $or: [{ brand: regex }] }
    )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate('image', 'image.url')
      .populate('createdBy', 'fullName');
    res.json({
      success: true,
      data: result,
    });
  } catch (e) {
    res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const _id = req.params.id;
    const findData = await Brand.findOne({ _id });
    console.log(findData.image);
    if (!findData.isActive == false) {
      const test = findData.image;
      req.deleteImageId = test;
      await deleteBrandPhoto(req, res);
      findData.isActive = false;
      findData.image = null;
      findData.save();
      return res.json({
        succes: true,
        message: 'brand deleted successfully',
      });
    } else {
      res.json({
        succes: false,
        message: 'brand already deleted',
      });
    }
  } catch (e) {
    res.json({
      succes: false,
      message: e.message,
    });
  }
};
