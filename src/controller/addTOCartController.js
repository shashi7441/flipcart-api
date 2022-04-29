const Cart = require('../models/addTOCart');
const Product = require('../models/product');
const { Apierror } = require('../utility/error');
// ....................... on the day....................
//  1. in increment fixing bug when price is more than 500
//

exports.addToCart = async (req, res, next) => {
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
        .populate('brandId', 'brand');
      if (!productData) {
        return next(new Apierror('product not found', 400));
      }

      if (element.quantity <= 0) {
        return next(new Apierror('please fill valid quantity', 400));
      }

      if (cartData) {
        const iteratorData = cartData.products;
        for (let i of iteratorData) {
          if (i.productId == element.productId) {
            return next(
              new Apierror(`${element.productId} already in cart`, 400)
            );
          }
        }
      }

      if (productData.isApprovedbyAdmin == false) {
        return next(
          new Apierror(
            `${productData.title} is not approved by admin so not sell`,
            400
          )
        );
      }
      if (productData.isAvailable == false) {
        return next(
          new Apierror(
            `${productData.title} is not approved by admin so not sell`,
            400
          )
        );
      }

      if (productData.quantity < element.quantity) {
        return next(new Apierror(`${productData.title} is out of stock`, 400));
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
      const actualAmount = cartData.totalPrice + totalAmount;
      const updateCart = await Cart.updateOne(
        { createdBy: req.userData._id },
        { $push: { products: productArray }, totalPrice: actualAmount },
        { new: true }
      );
      await cartData.save();
      for (let i of productArray) {
        const productData = await Product.findOne({ _id: i.productId });
        if (productData.quantity > 0) {
          productData.quantity -= i.quantity;
          productData.save();
        }
      }
      const result = await Cart.findOne({ createdBy: req.userData._id });
      return res.json({
        statusCode: 200,
        message: 'added into cart successfully',
        data: result,
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
           await productData.save();
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

exports.incrementAndDecrement = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const value = req.query.value;
    let cartData = await Cart.findOne({ createdBy: req.id });
    let found = cartData.products.find((element) => element.id === _id);
    if (!found) {
      return next(new Apierror('product not found in your cart', 400));
    }
    if (!cartData) {
      return next(new Apierror('data not found', 400));
    }
    if (!['increment', 'decrement'].includes(value)) {
      return next(new Apierror('wrong entry', 400));
    }

    if (value == 'increment') {
      if (cartData) {
        if (found) {
          const oldQuantity = found.quantity;
          const productData = await Product.findOne({ _id: found.productId })
            .populate('categoryId', 'category')
            .populate('brandId', 'brand')
            .populate('createdBy', 'fullName')
            .populate('image', 'image.url');
          if (found.quantity < productData.quantity) {
            found.quantity += 1;
            await cartData.save();
            productData.quantity -= 1;
            await productData.save();
            const actualQuantity = found.quantity - oldQuantity;
            const price = productData.price * actualQuantity;
            const cartPrice = cartData.totalPrice + price;
            const shippingCharge = 40;

            if (cartPrice > 500) {
              const updateCart = await Cart.updateOne(
                { createdBy: req.id },
                {
                  totalPrice: cartPrice,
                  priceWithShippingCharge: shippingCharge,
                },
                { new: true }
              );
              const result = await Cart.findOne({ createdBy: req.id });
              return res.json({
                statusCode: 200,
                message: 'updated successfully',
                data: {
                  totalAmount:
                    result.totalPrice + result.priceWithShippingCharge,
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
    } else {
      if (cartData) {
        if (found) {
          const oldQuantity = found.quantity;
          const productData = await Product.findOne({ _id: found.productId })
            .populate('categoryId', 'category')
            .populate('brandId', 'brand')
            .populate('createdBy', 'fullName')
            .populate('image', 'image.url');
          if (found.quantity > 0) {
            if (found.quantity > 0) {
              found.quantity -= 1;
              const updateQuantity = found.quantity;
              return next(new Apierror('quantity is not be less than 1', 400));
            }
            await cartData.save();
            productData.quantity += 1;
            await productData.save();
            const actualQuantity = found.quantity - oldQuantity;
            const price = productData.price * actualQuantity;
            const cartPrice = cartData.totalPrice + price;
            const updateCart = await Cart.updateOne(
              { createdBy: req.id },
              {
                totalPrice: cartPrice,
              },
              { new: true }
            );
            const result = await Cart.findOne({ createdBy: req.id });
            await cartData.save();
            return res.json({
              statusCode: 200,
              message: 'updated successfully',
              data: {
                totalAmount: result.totalPrice,
                data: result,
              },
            });
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

// ......................????????????????????????................
// if (cartData.totalPrice > 500) {
//   const updateCart = await Cart.updateOne(
//     { createdBy: req.id },
//     {
//       totalPrice: cartPrice,
//       priceWithShippingCharge: null,
//     },

//     { new: true }
//   );
//   await cartData.save();
//   const result = await Cart.findOne({ createdBy: req.id });
//   return res.json({
//     statusCode: 200,
//     message: 'updated successfully',
//     data: {
//       totalAmount: result.totalPrice,
//       data: result,
//     },
//   });
// } else {
//   console.log('else>>>>>>>>>');
//   const updateCart = await Cart.updateOne(
//     { createdBy: req.id },
//     {
//       totalPrice: actualDecrementPriceWhithoutShippingCharge,
//     },
//     { new: true }
//   );
//   await cartData.save();
//   const result = await Cart.findOne({ createdBy: req.id });
//   return res.json({
//     statusCode: 200,
//     message: 'updated successfully',
//     data: {
//       totalAmount: result.totalPrice,
//       data: result,
//     },
//   });
// }

exports.allCart = async (req, res, next) => {
  try {
    const allCart = await Cart.find({ createdBy: req.id });
    if (!allCart) {
      return next(new Apierror('item not found', 400));
    }
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

exports.deleteOneItemInCart = async (req, res, next) => {
  try {
    const _id = req.params.id;
    console.log(req.userData._id);
    const cartData = await Cart.findOne({ createdBy: req.userData._id });
    let found = cartData.products.find((element) => element.id === _id);
    if (!found) {
      return next(new Apierror('product not found in cart', 400));
    }
    if (found) {
      const productData = await Product.findOne({ _id: found.productId });
      const price = productData.price;
      const quantity = found.quantity;
      const totalAmount = price * quantity;
      const totalPriceInCart = cartData.totalPrice;
      const actualPrice = totalPriceInCart - totalAmount;

      const actualproductQuantity = productData.quantity + quantity;
      // console.log(actualproductQuantity);
      const updateProductQuantity = await Product.updateOne(
        { _id: found.productId },
        { quantity: actualproductQuantity },
        { new: true }
      );
      const updateCartData = await Cart.updateOne(
        { createdBy: req.userData.id },
        { $pull: { products: { _id: _id } }, totalPrice: actualPrice },
        { new: true }
      );
      const result = await Cart.findOne({ createdBy: req.userData._id });
      return res.json({
        statusCode: 200,
        message: 'delete product in cart successfully',
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.deleteAllItemInCart = async (req, res, next) => {
  try {
    const _id = req.userData._id;
    const updateData = await Cart.updateMany(
      { createdBy: _id },
      { products: [], totalPrice: null, priceWithShippingCharge: null },
      { new: true }
    );
    const actualUpdate = updateData.acknowledged;
    if (actualUpdate == true) {
      return next(new Apierror('already all item delete in cart', 400));
    }
    return res.status(200).json({
      statusCode: 200,
      message: 'delete all item in cart',
    });
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};
