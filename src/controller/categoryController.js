const Category = require('../models/category');
const { uploadSingleImage } = require('../utility/multer');
const {
  createCategoryPhoto,
  deleteCategoryPhoto,
  updateCategoryPhoto,
  createAndUpdateCategoryPhoto,
} = require('../service/categoryServices');

const Photo = require('../models/image');
exports.updateCategory = async (req, res) => {
  try {
    console.log('111111111111111111111');
    const { category, image } = req.body;
    const _id = req.params.id;
    const data = await Category.findOne({ _id, isActive: true });
    req.category_Id = data._id;
    if (Object.entries(req.body).length == 0) {
      res.json({
        success: false,
        message: ' please fill the field',
      });
    }
    if (data) {
      req.updateImageId = data.image;
      console.log(req.files);
      if (req.files) {
        const newResult = await Photo.findOne({ categoryId: req.category_Id });
        console.log('newresult', newResult);
        if (newResult) {
          const result = await Category.findOneAndUpdate(
            { _id: _id },
            { image },
            { new: true }
          );
          await updateCategoryPhoto(req, res);
        } else {
          await uploadSingleImage(req, res);
          await createAndUpdateCategoryPhoto(req, res);
          const newData = await Category.findOneAndUpdate(
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
              categoryId: req.category_Id,
            });
            if (newResult) {
              const result = await Category.findOneAndUpdate(
                { _id: _id },
                { image },
                { new: true }
              );
              // await updatePhoto(req, res);
              await updateCategoryPhoto(req, res);
            } else {
              // ...............................working..........................
              await uploadSingleImage(req, res);
              await createAndUpdateCategoryPhoto(req, res);
              // await uploadImges(req, res);
              // await createAndUpdatePhoto(req, res);
              const newData = await Category.findOneAndUpdate(
                { _id: _id },
                { image: req.photo_id },
                { new: true }
              );
            }
          }
        }
        if (req.body) {
          const { category } = req.body;
          const result = await Category.findOneAndUpdate(
            { _id: _id },
            {
              category,
            },
            { new: true }
          );
          const categoryFind = await Category.findOne({
            category: req.body.category,
          })
            .populate('image', 'image.url')
            .populate('createdBy', 'fullName');
          return res.json({
            success: true,
            message: 'updated successfully',
            data: categoryFind,
          });
        }
      }
    } else {
      res.json({
        succes: false,
        message: ' category not found',
      });
    }
  } catch (e) {
    res.json({
      succes: false,
      data: e.message,
    });
  }
};

exports.createCategory = async (req, res) => {
  const { category, image } = req.body;
  console.log('>>>>>>>>>>>>>>', req.files);
  // console.log('in category', category);
  try {
    const findData = await Category.findOne({
      category: req.body.category,
    });

    if (!findData) {
      if (!req.files.length == 0) {
        console.log('00000000000000000000');
        await uploadSingleImage(req, res);
        await createCategoryPhoto(req, res);
      }
    }
    console.log('req.body', req.body);

    if (req.body) {
      console.log('11111111111111111111111111');
      if (!req.results) {
        console.log('22222222222222222222222222222');
        const findData = await Category.findOne({
          category: req.body.category,
        });
        if (!findData) {
          const createDocument = await Category({
            category,
            createdBy: req.id,
          });
          const result = await createDocument.save();
          res.json({
            success: true,
            message: 'category created successful',
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
        const findData = await Category.findOne({
          category: req.body.category,
        });
        if (!findData) {
          const createDocument = await Category({
            category,
            createdBy: req.id,
            image: req.results._id,
          });
          const result = await createDocument.save();
          const categoryFind = await Category.findOne({
            category: req.body.category,
          })
            .populate('image', 'image.url')
            .populate('createdBy', 'fullName');
          req.results.categoryId = result._id;
          req.results.save();
          res.json({
            success: true,
            message: 'category created successful',
            data: categoryFind,
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

exports.showCategory = async (req, res) => {
  try {
    const search = req.query.search;
    const regex = new RegExp(search, 'i');
    const result = await Category.find(
      { createdBy: req.id },
      { $or: [{ category: regex }] }
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
exports.deleteCategory = async (req, res) => {
  try {
    const _id = req.params.id;
    const findData = await Category.findOne({ _id });
    console.log(findData.image);
    if (!findData.isActive == false) {
      const test = findData.image;
      req.deleteImageId = test;
      await deleteCategoryPhoto(req, res);
      findData.isActive = false;
      findData.image = null;
      findData.save();
      return res.json({
        succes: true,
        message: 'categoty deleted successfully',
      });
    } else {
      res.json({
        succes: false,
        message: 'category already deleted',
      });
    }
  } catch (e) {
    res.json({
      success: false,
      message: e.message,
    });
  }
};
