const User = require('../models/user');
// const redis = require('redis');
const Product = require('../models/product');
const {
  cheackBrandCategory,
  filterCheack,
  productFields,
} = require('../service/productService');
const {
  createPhoto,
  createAndUpdatePhoto,
  deletePhoto,
  updatePhoto,
} = require('../controller/photoController');
const Photo = require('../models/image');
const { showImage } = require('../controller/photoController');
const { uploadImges } = require('../utility/multer');
const { search } = require('../routes/category');

// const client = redis.createClient();
// client.connect();

exports.createProduct = async (req, res) => {
  try {
    if (req.files) {
      if (req.files.length > 0) {
        const productData = await Product.findOne({ title: req.body.title });
        if (!productData) {
          await uploadImges(req, res);
          await createPhoto(req, res);
        }
      }
    }
    if (req.body) {
      if (!req.results) {
        const productData = await Product.findOne({ title: req.body.title });

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
            quantity,
            createdBy: req.id,
          });

          const result = await createProduct.save();
          const produtfind = await Product.findOne({ title: req.body.title })
            .populate('brandId', 'brand')
            .populate('categoryId', 'category')
            .populate('image', 'image.url')
            .populate('createdBy', 'fullName');
          res.json({
            success: true,
            message: 'product created successfully',
            data: produtfind,
          });
        } else {
          res.json({
            success: false,
            message: 'product already exist ',
          });
        }
      } else {
        const productData = await Product.findOne({ title: req.body.title });
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
          rating,
          quantity,
        } = req.body;
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
            quantity,
          });
          const result = await createProduct.save();
          req.results.productId = result._id;
          req.results.save();
          const produtfind = await Product.findOne({ title: req.body.title })
            .populate('brandId', 'brand')
            .populate('categoryId', 'category')
            .populate('image', 'image.url')
            .populate('createdBy', 'fullName');
          res.json({
            success: true,
            message: 'product created successfully',
            data: produtfind,
          });
        } else {
          res.json({
            success: false,
            message: 'product already exist ',
          });
        }
      }
    }
  } catch (e) {
    // console.log(e);

    res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    // console.log(req.id);
    const search = req.query.search;
    const regex = new RegExp(search, 'i');

    const find = await Product.find({ createdBy: req.id })
      .populate('brandId', 'brand')
      .populate('categoryId', 'category')
      .populate('image', 'image.url')
      .populate('createdBy', 'fullName');
    console.log('>>>>>>>>>>>>>>???>>>>>>>>>>>>');
    if (!find) {
      res.json({
        success: false,
        message: 'data not found',
      });
    }
    const { page = 1, limit = 5 } = req.query;
    const filter = filterCheack(req, res);
    console.log('.................', filter);

    if (filter === false) {
      return res.status(404).json({
        message: 'please enter valid fields',
      });
    } else {
      const allfields = productFields(req);
      const result = await Product.find(filter, {
        $or: [{ title: regex }, { services: regex }],
      })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .populate('categoryId', 'category')
        .populate('brandId', 'brand')
        .populate('createdBy', 'fullName')
        .populate('image', 'image.url');

      // ...........!!!!!!!!!!!!!!!!!!!!!use redis ..........!!!!!!!!!!!!!!!!!!!!

      // const redis_0 = await client.setEx('product', 60, JSON.stringify(result));
      // console.log(redis_0);

      return res.status(200).json({
        message: 'data founded',
        totalProduct: result.length,
        succes: true,
        data: result,
      });
    }
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
      data: e,
    });
  }
};
// ...................!!!!!!!!!!!!!!!!!redis middleware...........!!!!!!!!!!!!!!!!!!!!!!

// exports.redis_product = async (req, res, next) => {
//   console.log('hiiiiiiiiiiiiiiiiiii');

//   const get_O = await client.get('product');
//   res.json({
//     succes: true,
//     data: JSON.parse(get_O),
//   });
//   // ,(e, result) => {
//   //   console.log("redis", e , result);
//   //   if (e) {
//   //     console.log("hiiiiiiiiiiiiiii",e);
//   //   } else {
//   //     console.log('redis_data');
//   //     res.send(JSON.parse(result));
//   //   }
//   // }
// };

exports.updateProducts = async (req, res) => {
  try {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    const _id = req.params.id;
    const data = await Product.findOne({ _id, isActive: true });
    req.product_Id = data._id;
    if (data) {
      req.updateImageId = data.image;
      const { image } = req.body;
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
            await uploadImges(req, res);
            await createAndUpdatePhoto(req, res);
            const newData = await Product.findOneAndUpdate(
              { _id: _id },
              { image: req.photo_id }
            );
          }
        }
      }
      if (req.body) {
        const {
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
        } = req.body;
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
        const produtfind = await Product.findOne({ title: req.body.title })
          .populate('brandId', 'brand')
          .populate('categoryId', 'category')
          .populate('image', 'image.url')
          .populate('createdBy', 'fullName');
        return res.json({
          success: true,
          message: 'updated successfully',
          data: produtfind,
        });
      }
    } else {
      res.json({
        succes: false,
        message: 'product not found',
      });
    }
  } catch (e) {
    console.log(e);
    return res.json({
      success: false,
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
        success: true,
        message: 'product deleted successfully',
        data: productData,
      });
    } else {
      // console.log('2222222222222222222222222222222');
      return res.json({
        success: false,
        message: 'product already deleted',
      });
    }
  } catch (e) {
    res.json({
      success: false,
      data: e.message,
    });
  }
};

exports.showOneProduct = async (req, res) => {
  const _id = req.params.id;

  const find = await Product.find({ _id: _id })
    .populate('brandId', 'brand')
    .populate('categoryId', 'category')
    .populate('image', 'image.url')
    .populate('createdBy', 'fullName');

  res.json({
    succes: true,
    message: 'product found successfully',
    data: find,
  });
};
