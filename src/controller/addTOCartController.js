const Cart = require('../models/addTOCart');
const Product = require('../models/product');
exports.addToCart = async (req, res) => {
  try {
    const {
      productId,
      quantity,
      products,
      totalPrice,
      shippingCharge,
      createdBy,
    } = req.body;
    const productArray = [];
    let totalAmount = 0;

    const cartData = await Cart.findOne({ createdBy: req.userData._id });
    for (let element of products) {
      const productData = await Product.findOne({ _id: element.productId })
        .populate('categoryId', 'category')
        .populate('brandId', 'brand')
        .populate('createdBy', 'fullName'); //...........
      if (!productData) {
        return res.json({
          statusCode: 400,
          message: 'product not found',
        });
      }
      if (cartData) {
        const iteratorData = cartData.products;
        for (i of iteratorData) {
          if (i.productId == element.productId) {
            return res.status(400).json({
              statusCode: 400,
              message: 'product already exist', //message: already in cart
            });
          }
        }
      }

      // if (productData.isApprovedbyAdmin == false) {
      //   return res.json({
      //     statusCode: 400,
      //     message: `${productData.title} is not approved by admin so not sell`,
      //   });
      // }
      // if (productData.isAvailable == false) {
      //   return res.json({
      //     statusCode: 400,
      //     message: `${productData.title} is not available`,
      //   });
      // }
      if (productData.quantity < element.quantity) {
        return res.json({
          statusCode: 400,
          message: `${productData.title} is out of stock`,
        });
      }

      productArray.push({
        productId: productData._id,
        quantity: element.quantity,
      });

      const productPrice = productData.price * element.quantity;
      totalAmount += productPrice;
    }
    const totalAmountWithShippingCharge = totalAmount + 40;

    if (cartData) {
      const previousAmount = cartData.totalPrice + totalAmount;
      const updateCart = await Cart.updateOne(
        { createdBy: req.userData._id },
        { $push: { products: productArray }, totalPrice: previousAmount },
        { new: true }
      );
      for (let i of productArray) {
        const productData = await Product.findOne({ _id: i.productId });
        if (productData.quantity > 0) {
          productData.quantity -= i.quantity;
          productData.save();
        }
      }
      return res.json({
        statusCode: 200,
        message: 'added into cart successfully',
        data: cartData,
      });
    }

    if (!cartData) {
      if (totalAmount >= 500) {
        const createCart = await Cart({
          products: productArray,
          createdBy: req.userData._id,
          totalPrice: totalAmountWithShippingCharge,
        });
        const result = await createCart.save();
        for (let i of productArray) {
          const productData = await Product.findOne({ _id: i.productId });
          if (productData.quantity > 0) {
            productData.quantity -= i.quantity;
            productData.save();
          }
        }
        return res.json({
          success: true,
          statusCode: 201,
          message: 'added in cart successfully',
          data: {
            shippingCharge: 40,
            data: result,
          },
        });
      } else {
        const createCart = await Cart({
          products: productArray,
          createdBy: req.userData._id,
          totalPrice: totalAmount,
        });
        const result = await createCart.save();
        for (i of productArray) {
          const productData = await Product.findOne({ _id: i.productId });
          if (productData.quantity > 0) {
            productData.quantity -= i.quantity;
            productData.save();
          }
        }

        return res.json({
          success: true,
          statusCode: 201,
          message: 'added in cart successfully',
          data: result,
        });
      }
    }
  } catch (e) {
    console.log(e);
    return res.json({
      success: false,
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const _id = req.params.id;
    const cartData = await Cart.findOneAndDelete({ _id });
    return res.json({
      statusCode: 200,
      message: 'cart deleted successfully',
    });
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.incrementAndDecrement = async (req, res) => {
  try {
    const _id = req.params.id;
    const value = req.query.value;
    const cartData = await Cart.findOne({ createdBy: req.id });
    const found = cartData.products.find((element) => element.id === _id);

    const oldQuantity = found.quantity;
    console.log(oldQuantity);
    const productData = await Product.findOne({ _id: found.productId })
      .populate('categoryId', 'category')
      .populate('brandId', 'brand')
      .populate('createdBy', 'fullName')
      .populate('image', 'image.url');
    if (!cartData) {
      return res.json({
        statusCode: 400,
        message: 'data not found',
      });
    }
    if (!value.toString() == 'increment' || value.toString() == 'decrement') {
      return res.json({
        statusCode: 400,
        message: 'wrong entry',
      });
    }

    if (value == 'increment') {
      if (cartData) {
        if (found.quantity < productData.quantity) {
          found.quantity += 1;
          await cartData.save();
          productData.quantity -= 1;
          await productData.save();
          const actualQuantity = found.quantity - oldQuantity;

          const price = productData.price * actualQuantity;
          const cartPrice = cartData.totalPrice + price;
          const shippingCharge = 40;
          if (cartPrice >= 500) {
            const updateCart = await Cart.updateOne(
              { createdBy: req.id },
              { totalPrice: priceWithShippingCharge },
              { new: true }
            );
            const result = await Cart.findOne({ createdBy: req.id });
            return res.json({
              statusCode: 200,
              message: 'updated successfully',
              data: {
                shippingCharge: shippingCharge,
                totalAmountWithShipppingCharge: cartPrice,
                data: result,
              },
            });
          } else {
            const updateCart = await Cart.updateOne(
              { createdBy: req.id },
              { totalPrice: cartPrice },
              { new: true }
            );
            const result = await Cart.findOne({ createdBy: req.id });
            return res.json({
              statusCode: 200,
              message: 'updated successfully',
              data: result,
            });
          }
        }
      }
    }
    //   if (cartData.quantity > 0) {
    //     cartData.quantity -= 1;
    //     await cartData.save();
    //     const setData = await redis.set('my_value', cartData);
    //     // console.log('in decrement', setData);
    //     const findData = await Cart.findOne({ _id, createdBy: req.id });
    //     const productsData = await Product.find({ _id: cartData.ProductId });
    //     productsData.map((element) => {
    //       const totalPrice = element.price * cartData.quantity;
    //       return res.json({
    //         statusCode: 200,
    //         message: 'updated successfully',
    //         totalPrice: totalPrice,
    //         data: findData,
    //       });
    //     });

    //     return res.json({
    //       statusCode: 400,
    //       message: 'quantity value is not negative  ',
    //     });
    //   }
  } catch (e) {
    console.log(e);
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.allCart = async (req, res, next) => {
  try {
    const allCart = await Cart.find({ createdBy: req.id });

    return res.json({
      success: true,
      status: 200,
      data: allCart,
    });
  } catch (e) {
    return res.json({
      success: false,
      status: 200,
      message: e.message,
    });
  }
};

exports.deleteAllCart = async (req, res) => {
  try {
    const _id = req.id;
    const deleteAll = await Cart.deleteMany({ createdBy: _id });

    console.log(deleteAll);

    return res.json({
      statusCode: 200,
      message: 'deleted successfullly',
    });
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};
