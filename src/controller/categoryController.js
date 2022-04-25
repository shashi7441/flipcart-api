const Category = require('../models/category');
const { uploadImagesForCategory } = require('../utility/multer');
const {
  createCategoryPhoto,
  deleteCategoryPhoto,
  updateCategoryPhoto,
  createAndUpdateCategoryPhoto,
} = require('../service/categoryServices');

const Photo = require('../models/image');

exports.updateCategory = async (req, res) => {
  try {
    const { category, image } = req.body;
    const _id = req.params.id;
    const data = await Category.findOne({ _id: _id });
    if (!data) {
      return res.json({
        statusCode:400,
        message: 'category not found',
      });
    }

    req.category_Id = data._id;
    if (Object.entries(req.body).length == 0) {
      return res.json({
        statusCode:400,
        message: ' please fill the field',
      });
    }

    if (req.files) {
      if (req.files.length > 1) {
        return res.json({
          statusCode:400,
          message: 'upload only single image',
        });
      }
    }

    req.updateImageId = data.image;
    if (req.files) {
      const newResult = await Photo.findOne({ categoryId: req.category_Id });
      if (newResult) {
        await updateCategoryPhoto(req, res);
      } else {
        await uploadImagesForCategory(req, res);
        await createAndUpdateCategoryPhoto(req, res);
        const newData = await Category.findOneAndUpdate(
          { _id: _id },
          { image: req.photo_id },
          { new: true }
        );
        const categoryFind = await Category.findOne({
          category: req.body.category,
        })
          .populate('image', 'image.url')
          .populate('createdBy', 'fullName');
        return res.json({
          statusCode:200,
          message: 'updated successfully',
          data: categoryFind,
        });
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
        statusCode:200,
        message: 'updated successfully',
        data: categoryFind,
      });
    }
  } catch (e) {
    console.log(e);

    res.json({
      statusCode:400,
      data: e.message,
    });
  }
};

exports.createCategory = async (req, res) => {
  const { category, image } = req.body;
  try {
    const findData = await Category.findOne({
      category: req.body.category,
    });

    if (findData) {
      return res.json({
        statusCode:400,
        message: 'already exists',
      });
    }
    if (req.files) {
      if (req.files.length > 1) {
        return res.json({
          statusCode:400,
          message: 'you can upload only one file',
        });
      }
      if (!req.files.length == 0) {
        await uploadImagesForCategory(req, res);
        await createCategoryPhoto(req, res);
      }
    }
    if (req.body) {
      if (!req.results) {
        const findData = await Category.findOne({
          category: req.body.category,
        });
        if (!findData) {
          const createDocument = await Category({
            category,
            createdBy: req.id,
          });
          const result = await createDocument.save();
          const categoryFind = await Category.findOne({
            category: req.body.category,
          })
            .populate('image', 'image.url')
            .populate('createdBy', 'fullName');

          return res.json({
            statusCode:200,
            message: 'category created successful',
            data: categoryFind,
          });
        }
      } else {
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
            category: category,
          })
            .populate('image', 'image.url')
            .populate('createdBy', 'fullName');
          req.results.categoryId = result._id;
          req.results.save();
          return res.json({
            statusCode:200,
            message: 'category created successful',
            data: categoryFind,
          });
        } else {
          return res.json({
            statusCode:400,
            message: 'already exists',
          });
        }
      }
    }
  } catch (e) {
    return res.json({
      statusCode:400,
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
      statusCode:200,
      data: result,
    });
  } catch (e) {
    res.json({
      statusCode:400,
      message: e.message,
    });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const _id = req.params.id;
    const findData = await Category.findOne({ _id });
    if (!findData) {
      return res.json({
        statusCode:400,
        message: 'catogory not found',
      });
    }

    console.log(findData.image);
    if (!findData.isActive == false) {
      const test = findData.image;
      req.deleteImageId = test;
      await deleteCategoryPhoto(req, res);
      findData.isActive = false;
      findData.image = null;
      findData.save();
      return res.json({
        statusCode:200,
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
      statusCode:400,
      message: e.message,
    });
  }
};
