const Cart = require('../models/addTOCart');
const Product = require('../models/product');

exports.addToCart = async (req, res) => {
  try {
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

            res.json({
              success: true,
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
          const cartData = await Cart.findOne({
            ProductId: req.body.ProductId,
            createdBy: req.id,
          });
          if (cartData.quantity < productData.quantity) {
            cartData.quantity += 1;
            cartData.save();

            const find = await Cart.findOne({
              ProductId: req.body.ProductId,
              createdBy: req.id,
            });
            res.json({
              success: true,
              data: cartData,
            });
          } else {
            res.json({
              success: false,
              message: 'product out of stock',
            });
          }
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

exports.deleteCart = async (req, res) => {
  try {
    console.log('hiiiiiiiiiiiiiiiiiiii');
    const _id = req.params.id;
    const cartData = await Cart.findOneAndDelete({ _id });
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
