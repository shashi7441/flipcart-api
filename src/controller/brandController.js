const Brand = require('../models/brand');
require('dotenv').config();
const { uploadImagesForBrand } = require('../utility/multer');
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
exports.updateBrand = async (req, res, next) => {
  try {
    const { brand, image } = req.body;
    const _id = req.params.id;
    const data = await Brand.findOne({ _id: _id, isActive: true });
    if (!data) {
      return next(new Apierror('brand not found', 400));
    }
    req.brand_Id = data._id;

    if (Object.entries(req.body).length == 0) {
      return next(new Apierror('please fill the field', 400));
    }

    if (req.files) {
      if (req.files.length > 1) {
        return next(new Apierror('upload only single image', 400));
      }
    }

    if (data) {
      req.updateImageId = data.image;
      if (req.files) {
        if (!req.files.length == 0) {
          const newResult = await Photo.findOne({ brandId: req.brand_Id });
          if (newResult) {
            await updateBrandPhoto(req, res);
          } else {
            await uploadImagesForBrand(req, res);
            await createAndUpdateBrandPhoto(req, res);
            const newData = await Brand.findOneAndUpdate(
              { _id: _id },
              { image: req.photo_id },
              { new: true }
            );
            const brandFind = await Brand.findOne({
              brand: req.body.brand,
            })
              .populate('image', 'image.url')
              .populate('createdBy', 'fullName');
            return res.json({
              statusCode: 200,
              message: 'updated successfully',
              data: brandFind,
            });
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
          statusCode: 200,
          message: 'updated successfully',
          data: brandFind,
        });
      }
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      data: e.message,
    });
  }
};

exports.createBrand = async (req, res, next) => {
  const { brand, image } = req.body;
  try {
    if (req.files) {
      if (req.files.length > 1) {
        return next(new Apierror('upload only single image', 400));
      }
    }
    if (!req.files.length == 0) {
      await uploadImagesForBrand(req, res);
      await createBrandPhoto(req, res);
    }

    if (req.body) {
      if (!req.results) {
        const findData = await Brand.findOne({
          brand: req.body.brand,
        });

        if (findData) {
          return next(new Apierror('brand already exist', 400));
        }

        if (!findData) {
          const createDocument = await Brand({
            brand,
            createdBy: req.id,
          });
          const result = await createDocument.save();
          return res.json({
            statusCode: 200,
            message: 'brand created successful',
            data: result,
          });
        }
      } else {
        const findData = await Brand.findOne({
          brand: req.body.brand,
        });
        if (findData) {
          return next(new Apierror(' already exist', 400));
        }
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
          return res.json({
            statusCode: 200,
            message: 'brand created successful',
            data: brandFind,
          });
        }
      }
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      data: e.message,
    });
  }
};

exports.showBrand = async (req, res, next) => {
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
    if (!result) {
      return next(new Apierror('data not found ', 400));
    }

    return res.json({
      statusCode: 200,
      data: result,
    });
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.deleteBrand = async (req, res, next) => {
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
        statusCode: 200,
        message: 'brand deleted successfully',
      });
    } else {
      return next(new Apierror('brand already deleted', 400));
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};
