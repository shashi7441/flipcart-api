const Cart = require('../models/addTOCart');
const Product = require('../models/product');
const Redis = require('ioredis');
const { json } = require('body-parser');
const redis = new Redis();
new Redis({
  port: 6379, // Redis port
  host: '127.0.0.1', // Redis host
  username: 'default', // needs Redis >= 6
  password: 'my-top-secret',
  db: 0, // Defaults to 0
});

exports.addToCart = async (req, res) => {
  try {
    console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiii');
    const productData = await Product.findOne({ _id: req.body.ProductId })
      .populate('categoryId', 'category')
      .populate('brandId', 'brand')
      .populate('createdBy', 'fullName')
      .populate('image', 'image.url');
    if (!productData) {
      return res.json({
        success: false,
        message: 'product not found',
      });
    } else {
      if (productData.isActive == true) {
        console.log('1111111111111111111111111');
        const cartData = await Cart.findOne({
          ProductId: req.body.ProductId,
          createdBy: req.id,
        });
        if (!cartData) {
          console.log('2222222222222222222222222');
          const { quantity, ProductId } = req.body;
          console.log(quantity);
          if (quantity <= productData.quantity) {
            const create = await Cart({
              quantity: quantity,
              ProductId: ProductId,
              createdBy: req.id,
            });
            const result = await create.save();
            const totalPrice = productData.price * result.quantity;
            // console.log(">>>>>>>>>>>",result, totalPrice );
            // const newObj = { ...result };
            // console.log('newObj', newObj);
            console.log('result', result);
            const setData = await redis.set('my_value', result);
            console.log('>>>>>>>>>>', setData);
            res.json({
              success: true,
              totalPrice: totalPrice,
              message: 'cart added successsfully',
              data: result,
            });
          } else {
            console.log('3333333333333333333333333');
            res.json({
              success: false,
              message: 'product out of stock',
            });
          }
        } else {
          return res.json({
            success: false,
            message: 'already added into cart',
          });
        }
      } else {
        res.json({
          success: false,
          message: 'wrong entry',
        });
      }
    }
  } catch (e) {
    console.log('...................................', e);
    res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    console.log('hiiiiiiiiiiiiiiiiiiii');
    const _id = req.params.id;
    const cartData = await Cart.findOneAndDelete({ _id });
    redis.del('my_value');
    res.json({
      success: true,
      message: 'cart deleted successfully',
    });
  } catch (e) {
    res.json({
      success: false,
      message: e.message,
    });
  }
};
exports.incrementAndDecrement = async (req, res) => {
  try {
    const _id = req.params.id;
    const value = req.query.value;
    const cartData = await Cart.findOne({ _id, createdBy: req.id });
    const productData = await Product.findOne({ _id: cartData.ProductId })
      .populate('categoryId', 'category')
      .populate('brandId', 'brand')
      .populate('createdBy', 'fullName')
      .populate('image', 'image.url');

    if (!cartData) {
      res.json({
        success: false,
        message: 'data not found',
      });
    } else {
      if (value == 'increment') {
        const productsData = await Product.find({ _id: cartData.ProductId });
        if (cartData.quantity < productData.quantity) {
          cartData.quantity += 1;
          await cartData.save();
          const setData = await redis.set('my_value', cartData);
          console.log('setDAta in put', setData);
          const findData = await Cart.findOne({ _id, createdBy: req.id });
          productsData.map((element) => {
            const totalPrice = element.price * cartData.quantity;
            return res.json({
              success: true,
              message: 'updated successfully',
              totalPrice: totalPrice,
              data: findData,
            });
          });
        } else {
          res.json({
            success: false,
            message: 'product out of stock',
          });
        }
      } else if (value == 'decrement') {
        if (cartData.quantity > 0) {
          cartData.quantity -= 1;
          await cartData.save();
          const setData = await redis.set('my_value', cartData);
          console.log('in decrement', setData);
          const findData = await Cart.findOne({ _id, createdBy: req.id });
          const productsData = await Product.find({ _id: cartData.ProductId });
          productsData.map((element) => {
            const totalPrice = element.price * cartData.quantity;
            return res.json({
              success: true,
              message: 'updated successfully',
              totalPrice: totalPrice,
              data: findData,
            });
          });
        } else {
          res.json({
            success: false,
            message: 'quantity value is not negative  ',
          });
        }
      } else {
        res.json({
          success: false,
          message: 'wrong entry',
        });
      }
    }
  } catch (e) {
    res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.allCart = async (req, res, next) => {
  const allCart = await Cart.find({ createdBy: req.id }).populate(
    'ProductId',
    'price'
  );

  let price = 0;

  for (i of allCart) {
    price += i.quantity * i.ProductId.price;
  }
  const getData = await redis.get('my_value');

  console.log('>>>>>>>>>>>>>', getData);
  res.json({
    success: true,
    status: 200,
    message: 'data found',
    totalPrice: price,
    data: allCart,
  });
};

exports.deleteAllCart = async (req, res) => {
  try {
    const _id = req.id;
    const deleteAll = await Cart.deleteMany({ createdBy: _id });
    // allData.remove();
    console.log(deleteAll);

    res.json({
      success: true,
      message: 'deleted successfullly',
    });
  } catch (e) {
    res.json({
      success: false,
      message: e.message,
    });
  }
};
