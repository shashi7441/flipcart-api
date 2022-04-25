const User = require('../models/user');
// const redis = require('redis');
const Product = require('../models/product');
const { filterCheack, productFields } = require('../service/productService');
const {
  createPhoto,
  createAndUpdatePhoto,
  deletePhoto,
  updatePhoto,
} = require('../controller/photoController');
const Photo = require('../models/image');
const { uploadImagesForProduct } = require('../utility/multer');
const Review = require('../models/review');

// const client = redis.createClient();
// client.connect();

exports.createProduct = async (req, res) => {
  try {
    const randomNumber = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
    const selectDate = new Date(
      +new Date() + randomNumber * 24 * 60 * 60 * 1000
    );

    req.selectDate = selectDate;
    const {
      price,
      title,
      services,
      categoryId,
      brandId,
      image,
      color,
      availableOffer,
      size,
      quantity,
      rating,
    } = req.body;
    const productData = await Product.findOne({ title: title });
    if (productData) {
      return res.json({
        statusCode:400,
        message: 'prooduct already exist ',
      });
    }
    if (req.files) {
      console.log('1');
      if (req.files.length > 0) {
        if (!productData) {
          await uploadImagesForProduct(req, res);
          await createPhoto(req, res);
        }
      }
    }

    if (req.body) {
      if (!req.results) {
        if (!productData) {
          console.log('2');
          const createProduct = await Product({
            price,
            categoryId,
            title,
            services,
            brandId,
            color,
            availableOffer,
            size,
            rating,
            quantity,
            createdBy: req.id,
            deliverTime: req.selectDate,
          });

          const result = await createProduct.save();
          const produtfind = await Product.findOne({ title: title })
            .populate('brandId', 'brand')
            .populate('categoryId', 'category')
            .populate('image', 'image.url')
            .populate('createdBy', 'fullName');
          return res.json({
            statusCode:200,
            message: 'product created successfully',
            data: produtfind,
          });
        }
      } else {
        console.log('3');
        if (!productData) {
          const createProduct = await Product({
            price,
            categoryId,
            title,
            services,
            brandId,
            color,
            availableOffer,
            size,
            rating,
            image: req.results._id,
            createdBy: req.id,
            deliverTime: req.selectDate,
            quantity,
          });
          const result = await createProduct.save();
          req.results.productId = result._id;
          req.results.save();
          const produtfind = await Product.findOne({ title: title })
            .populate('brandId', 'brand')
            .populate('categoryId', 'category')
            .populate('image', 'image.url')
            .populate('createdBy', 'fullName');
          return res.json({
            statusCode:200,
            message: 'product created successfully',
            data: produtfind,
          });
        } else {
          return res.json({
            statusCode:400,
            message: 'product already exist ',
          });
        }
      }
    }
  } catch (e) {
    return res.json({
      statusCode:400,
      message: e.message,
    });
  }
};

exports.getAllProductsForPublic = async (req, res) => {
  try {
    const productFind = await Product.find({ isApprovedbyAdmin: true })
      .populate('brandId', 'brand')
      .populate('categoryId', 'category')
      .populate('image', 'image.url')
      .populate('createdBy', 'fullName');

    if (!productFind) {
      return res.json({
        statusCode:400,
        message: 'product not found',
      });
    }
    const _id = productFind._id;

    return res.status(200).json({
      message: 'product founded',
      totalProduct: productFind.length,
      succes: true,
      data: productFind,
    });
  } catch (e) {
    return res.json({
      statusCode:400,
      data: e.message,
    });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    console.log(req.id);
    const userData = await User.findOne({ _id: req.id });
    if (!userData) {
      return res.json({
        statusCode:400,
        message: 'user not found',
      });
    }
    
    console.log(userData);
    if (userData.role == 'user') {
      console.log("11111111111");
      const productFind = await Product.find({ isApprovedbyAdmin: true })
        .populate('brandId', 'brand')
        .populate('categoryId', 'category')
        .populate('image', 'image.url')
        .populate('createdBy', 'fullName');

      if (!productFind) {
        return res.json({
          statusCode:400,
          message: 'product not found',
        });
      }


      return res.status(200).json({
        message: 'product founded',
        totalProduct: productFind.length,
        statusCode:200,
        data: productFind,
      });
    } else if (userData.role == 'seller') {
      console.log("22222222222222222222");
      const search = req.query.search;
      const regex = new RegExp(search, 'i');

      const find = await Product.find({ createdBy: req.id })
        .populate('brandId', 'brand')
        .populate('categoryId', 'category')
        .populate('image', 'image.url')
        .populate('createdBy', 'fullName');

      if (!find) {
        return res.json({
          statusCode:400,
          message: 'product not found',
        });
      }
      const { page = 1, limit = 5 } = req.query;
      const filter = filterCheack(req, res);
      if (filter === false) {
        return res.status(404).json({
          message: 'please enter valid fields',
        });
      } else {
        const allfields = productFields(req);
        const result = await Product.find({
          $or: [{ title: regex }, { services: regex }],
        })
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .sort({ createdAt: -1 })
          .populate('categoryId', 'category')
          .populate('brandId', 'brand')
          .populate('createdBy', 'fullName')
          .populate('image', 'image.url');

        // ...........!!!!!!!!!!!!!!!!!!!!!use redis ..........!!!!!!!!!!!!!!!!!!!
        return res.status(200).json({
          message: 'product founded',
          totalProduct: result.length,
          succes: true,
          data: result,
        });
      }
    } else {
      console.log("33333333");
      const find = await Product.find({ isApprovedbyAdmin: false })
        .populate('brandId', 'brand')
        .populate('categoryId', 'category')
        .populate('image', 'image.url')
        .populate('createdBy', 'fullName');

      if (!find) {
        return res.json({
          statusCode:400,
          message: 'product not found',
        });
      }
      return res.status(200).json({
        message: 'product founded',
        totalProduct: find.length,
        statusCode:200,
        data: find,
      });
    }
  } catch (e) {
    console.log(e);
    return res.json({
      statusCode:400,
      data: e.message,
    });
  }
};

exports.updateProducts = async (req, res) => {
  try {
    const _id = req.params.id;
    const data = await Product.findOne({ _id, isActive: true });

    if (!data) {
      return res.json({
        statusCode:400,
        message: 'product not found',
      });
    }
    if (Object.entries(req.body).length == 0) {
      return res.json({
        statusCode:400,
        message: ' please fill the field',
      });
    }
    req.product_Id = data._id;
    const {
      price,
      title,
      services,
      categoryId,
      image,
      brandId,
      color,
      availableOffer,
      size,
      rating,
      quantity,
    } = req.body;

    req.updateImageId = data.image;
    if (req.files) {
      if (req.files.length > 0) {
        const newResult = await Photo.findOne({ productId: req.product_Id });
        if (newResult) {
          const result = await Product.findOneAndUpdate(
            { _id: _id },
            { image },
            { new: true }
          );
          await updatePhoto(req, res);
        } else {
          // ...............................working..........................
          await uploadImagesForProduct(req, res);
          await createAndUpdatePhoto(req, res);
          const newData = await Product.findOneAndUpdate(
            { _id: _id },
            { image: req.photo_id }
          );
        }
      }
    }
    if (req.body) {
      const result = await Product.findOneAndUpdate(
        { _id: _id },
        {
          price,
          title,
          services,
          categoryId,
          brandId,
          color,
          availableOffer,
          size,
          rating,
          quantity,
        },
        { new: true }
      );
      const produtfind = await Product.findOne({ title: title })
        .populate('brandId', 'brand')
        .populate('categoryId', 'category')
        .populate('image', 'image.url')
        .populate('createdBy', 'fullName');
      return res.json({
        statusCode:200,
        message: 'updated successfully',
        data: produtfind,
      });
    }
  } catch (e) {
    return res.json({
      statusCode:400,
      data: e.message,
    });
  }
};

exports.deleteProducts = async (req, res) => {
  try {
    const _id = req.params.id;
    // console.log(_id);
    const productData = await Product.findOne({ _id });
    if (!productData.isActive == false) {
      // console.log('1111111111111111111111');
      const test = productData.image;
      req.deleteImageId = test;
      deletePhoto(req, res);
      productData.isActive = false;
      productData.image = null;
      productData.save();
      return res.json({
        statusCode:200,
        message: 'product deleted successfully',
        data: productData,
      });
    } else {
      // console.log('2222222222222222222222222222222');
      return res.json({
        statusCode:400,
        message: 'product already deleted',
      });
    }
  } catch (e) {
    return res.json({
      statusCode:400,
      data: e.message,
    });
  }
};

exports.showOneProduct = async (req, res) => {
  try {
    const _id = req.params.id;
    const find = await Product.find({ _id: _id })
      .populate('brandId', 'brand')
      .populate('categoryId', 'category')
      .populate('image', 'image.url')
      .populate('createdBy', 'fullName');

    return res.json({
      statusCode:200,
      message: 'product found successfully',
      data: find,
    });
  } catch (e) {
    return res.json({
      statusCode:400,
      message: e.message,
    });
  }
};

exports.isApproved = async (req, res) => {
  try {
    const _id = req.params.id;
    const productData = await Product.findOne({ _id: _id })
      .populate('image', 'image.url')
      .populate('brandId', 'brand')
      .populate('categoryId', 'category');
    if (!productData) {
      return res.json({
        statusCode:400,
        message: 'product not found',
      });
    }
    if (productData.isApprovedbyAdmin == true) {
      return res.json({
        statusCode:400,
        message: 'already approved you can sell product',
      });
    }
    const updateProduct = await Product.findOneAndUpdate(
      { _id: _id },
      { isApprovedbyAdmin: true },
      { new: true }
    );

    return res.json({
      statusCode:200,
      message: 'ready to sell the product',
      data: updateProduct,
    });
  } catch (e) {
    return res.json({
      statusCode:400,
      message: e.message,
    });
  }
};

exports.showOneProductForPublic = async (req, res) => {
  try {
    const _id = req.params.id;
    const find = await Product.findOne({ _id: _id, isApprovedbyAdmin: true })
      .populate('brandId', 'brand')
      .populate('categoryId', 'category')
      .populate('image', 'image.url')
      .populate('createdBy', 'fullName');
    if (!find) {
      return res.json({
        statusCode:400,
        message: 'no product found',
      });
    }
    const reviewData = await Review.find({ productId: find._id }).populate(
      'userId',
      'fullName'
    );
    let sum = 0;
    for (i of reviewData) {
      sum += i.rating;
    }

    const average = sum / reviewData.length;
    const sortData = reviewData.sort((a, b) => {
      return b.rating - a.rating;
    });
    if (reviewData.length == 0) {
      console.log('1');
      return res.json({
        statusCode:200,
        message: 'product found successfully',
        message: 'No review found',
        data: find,
      });
    } else {
      return res.json({
        success: true,
        data: {
          productDetailes: find,
          totalReview: sortData.length,
          averageRating: average,
          review: sortData,
        },
      });
    }
  } catch (e) {
    return res.json({
      statusCode:400,
      message: e.message,
    });
  }
};
