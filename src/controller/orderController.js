const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const Address = require('../models/address');
const { sendMailToOrder } = require('../utility/mailSendOrder');
const { acceptData } = require('../utility/pdfGenerator');
const { Apierror } = require('../utility/error');
exports.order = async (req, res, next) => {
  try {
    const {
      orders,
      addressId,
      paymentMode,
    } = req.body;
    const orderData = await Order.findOne({ userId: req.id });

    const addressData = await Address.findOne({
      _id: addressId,
      isDefault: true,
      userId: req.id,
    });
    const userData = await User.findOne({ _id: req.id });
    if (!addressData) {
      return next(new Apierror('address not found', 400));
    }

    if (!userData) {
      return next(new Apierror('userData not found', 400));
    }

    let totalAmount = 0;
    const arr = [];
    for (const i of orders) {
      const productData = await Product.findOne({ _id: i.productId });
      if (!productData) {
        return next(new Apierror('product not found', 400));
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
        return next(new Apierror(`${productData.title} is not available`, 400));
      }
      if (productData.quantity < i.quantity) {
        return next(new Apierror(`${productData.title} is out of stock`, 400));
      }
      if (paymentMode) {
        if (productData.paymentMode != paymentMode) {
          return next(new Apierror(`${paymentMode} is not available`, 400));
        }
      }
      const productPrice = productData.price * i.quantity;
      totalAmount += productPrice;
      productData.quantity;
      arr.push({
        productId: productData._id,
        quantity: i.quantity,
      });
    }
    if (totalAmount > 500) {
      if (!orderData) {
        const totalPriceWithCharge = totalAmount + 40;
        const createOrder = await Order({
          userId: req.id,
          orders: arr,
          status: 'ordered',
          addressId,
          shippingcharge: 40,
          totalPrice: totalAmount,
          paymentMode: paymentMode,
          totalPriceWithShipingCharge: totalPriceWithCharge,
        });
        const result = await createOrder.save();

        for (i of arr) {
          const productData = await Product.findOne({ _id: i.productId });
          if (productData.quantity > 0) {
            productData.quantity -= i.quantity;
            productData.save();
          }
        }
        acceptData(result);
        await sendMailToOrder(req, res, result);
        return res.json({
          statusCode: 200,
          message: 'order placed successfull',
          data: result,
        });
      }
    } else {
      const createOrder = await Order({
        userId: req.id,
        orders: arr,
        status: 'ordered',
        addressId,
        totalPrice: totalAmount,
        paymentMode: paymentMode,
      });
      const result = await createOrder.save();

      for (i of arr) {
        const productData = await Product.findOne({ _id: i.productId });
        if (productData.quantity > 0) {
          productData.quantity -= i.quantity;
          productData.save();
        }
      }
      acceptData(result);
      return res.json({
        statusCode: 200,
        message: 'order placed successfull',
        data: result,
      });
    }
    // ......................if order found...................?

    // if (orderData) {
    //   if (orderData.totalAmount >= 500) {
    //     const actualAmount =
    //       orderData.totalPriceWithShipingCharge + totalAmount;
    //     const updateCart = await Cart.updateOne(
    //       { createdBy: req.id },
    //       { $push: { orders: arr }, totalPrice: actualAmount },
    //       { new: true }
    //     );
    //     for (let i of productArray) {
    //       const productData = await Product.findOne({ _id: i.productId });
    //       if (productData.quantity > 0) {
    //         productData.quantity -= i.quantity;
    //         productData.save();
    //       }
    //     }
    //     const result = await Order.findOne({ createdBy: req.id });

    //     return res.json({
    //       statusCode: 200,
    //       message: 'order  successfully',
    //       data: result,
    //     });
    //   }
    // }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const orderData = await Order.findOne({ _id: _id });
    if (!orderData) {
      return next(new Apierror('data not found', 400));
    }
    if (orderData.status == 'ordered') {
      const found = orderData.orders;
      for (let element of found) {
        let productData = await Product.findOne({ _id: element.productId });
        let userQuantity = element.quantity;
        productData.quantity += userQuantity;
        await productData.save();
      }

      const data = await Order.updateOne(
        { _id },
        { status: 'cancelled', isActive: false },
        { new: true }
      );
      const result = await Order.findOne({ _id: _id });

      return res.json({
        statusCode: 200,
        message: 'order cancelled successfully',
        data: result,
      });
    } else if (orderData.status == 'cancelled') {
      return next(new Apierror('order are already cancelled', 400));
    } else {
      return next(new Apierror('order are not cancelled', 400));
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.showOneOrder = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const orderFound = await Order.findOne({ _id, userId: req.id })
      .populate('userId', 'fullName phone')
      .populate('orders.productId', 'price title services')
      .populate('addressId', 'country state city pincode');
    if (!orderFound) {
      return next(new Apierror('data not found ', 400));
    }
    return res.json({
      statusCode: 200,
      data: orderFound,
    });
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.stateChange = async (req, res, next) => {
  try {
    const _id = req.params.id;
    if (Object.entries(req.body).length == 0) {
      return next(new Apierror(' please fill the field status', 400));
    }
    const status = req.body.status;
    if (!['shipped', 'dispatch'].includes(status)) {
      return next(new Apierror('status only have shipped and dispatch', 400));
    }

    const orderFound = await Order.findOne({ _id: _id, isActive: true });
    if (!orderFound) {
      return next(new Apierror('order not found ', 400));
    }
    const result = await Order.findByIdAndUpdate(
      { _id: _id },
      { status: status },
      { new: true }
    );
    return res.json({
      statusCode: 200,
      message: 'status updated successfully',
      data: result,
    });
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.deliverProduct = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const orderData = await Order.findOne({ _id: _id, isActive: true });
    if (!orderData) {
      return next(new Apierror('order not found ', 400));
    }
    if (orderData.status == 'ordered') {
      const updateData = await Order.updateOne(
        { _id: _id },
        { status: 'delivered' },
        { new: true }
      );

      return res.json({
        statusCode: 200,
        message: 'order deliver succeesfully',
        data: updateData,
      });
    } else {
      return next(new Apierror('wrong data', 400));
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.changeDate = async (req, res, next) => {
  try {
    const date = req.params.date;
    const nextDate = new Date(+new Date() + 1 * 24 * 60 * 60 * 1000);
    if (date === 'fastDeliveryDate') {
      const fastDeliveryCharge = 40;
      const updateData = await Order.findOneAndUpdate(
        { userId: req.id, isActive: true },
        {
          fastDeliverTime: nextDate,
          standardDeliveryTime: null,
          fastDeliveryCharge: fastDeliveryCharge,
        },
        { new: true }
      )
        .populate('orders.productId', 'price title services paymentMode image')
        .populate(
          'addressId',
          'country state city streat pincode landMark houseNumber'
        );
      if (!updateData) {
        return next(new Apierror('no order found', 400));
      }

      const totalAmountWithCharges =
        updateData.totalPrice + updateData.fastDeliveryCharge;
      updateData.totalPriceWithFastDeliveryCharge = totalAmountWithCharges;
      updateData.save();
      return res.json({
        success: true,
        message: 'updated successfully',
        totalPrice: updateData.totalPrice,
        deleveryCharge: updateData.fastDeliveryCharge,
        totalPriceIncludingCharge: updateData.totalPriceWithFastDeliveryCharge,
        data: updateData,
      });
    } else if (date === 'standardDeliveryDate') {
      const orderData = await Order.findOneAndUpdate(
        { userId: req.id, isActive: true },
        {
          fastDeliverTime: null,
          fastDeliveryCharge: null,
          totalPriceWithFastDeliveryCharge: null,
        },
        { new: true }
      )
        .populate(
          'orders.productId',
          'price title services paymentMode deliverTime'
        )
        .populate(
          'addressId',
          'country state city streat pincode landMark houseNumber'
        );
      if (!orderData) {
        return next(new Apierror('no order found', 400));
      }

      return res.json({
        statusCode: 200,
        data: orderData,
      });
    } else {
      return next(new Apierror('wrong data select', 400));
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};
