const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const Address = require('../models/address');
const { pdfGenerator } = require('../utility/pdfGenerator');
const { sendMailToOrder } = require('../utility/mailSendOrder');
const { acceptData } = require('../utility/pdfGenerator');
exports.order = async (req, res) => {
  try {
    const {
      userId,
      orders,
      deliverTime,
      expectedDeliverTime,
      addressId,
      paymentMode,
    } = req.body;

    const addressData = await Address.findOne({
      _id: addressId,
      isDefault: true,
      userId: req.id,
    });
    const userData = await User.findOne({ _id: req.id });
    if (!addressData) {
      return res.json({
        statusCode: 400,
        message: 'address not found',
      });
    }

    if (!userData) {
      return res.json({
        statusCode: 400,
        message: 'userData not found',
      });
    }

    let totalAmount = 0;
    const arr = [];
    for (const i of orders) {
      const productData = await Product.findOne({ _id: i.productId });
      if (!productData) {
        return res.json({
          statusCode: 400,
          message: 'product not found',
        });
      }

      if (productData.isApprovedbyAdmin == false) {
        return res.json({
          statusCode: 400,
          message: `${productData.title} is not approved by admin so not sell`,
        });
      }
      if (productData.isAvailable == false) {
        return res.json({
          statusCode: 400,
          message: `${productData.title} is not available`,
        });
      }
      if (productData.quantity < i.quantity) {
        return res.json({
          statusCode: 400,
          message: `${productData.title} is out of stock`,
        });
      }
      if (paymentMode) {
        if (productData.paymentMode != paymentMode) {
          return res.json({
            statusCode: 400,
            message: `${paymentMode} is not available`,
          });
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
    if (totalAmount <= 500) {
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
  } catch (e) {
    console.log(e);
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const _id = req.params.id;
    const orderData = await Order.findOne({ _id: _id });
    if (!orderData) {
      return res.json({
        statusCode: 400,
        message: 'data not found',
      });
    }
    if (orderData.status == 'ordered') {
      const data = await Order.updateOne(
        { _id },
        { status: 'cancelled' },
        { new: true }
      );
      return res.json({
        statusCode: 200,
        message: 'order cancelled successfully',
        data: orderData,
      });
    } else if (orderData.status == 'cancelled') {
      return res.json({
        statusCode: 400,
        message: 'order are already cancelled',
      });
    } else {
      return res.json({
        statusCode: 400,
        message: 'order are not cancelled',
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.showOneOrder = async (req, res) => {
  try {
    const _id = req.params.id;
    const orderFound = await Order.findOne({ _id, userId: req.id })
      .populate('userId', 'fullName phone')
      .populate('orders.productId', 'price title services')
      .populate('addressId', 'country state city pincode');

    console.log(orderFound);
    if (!orderFound) {
      return res.json({
        statusCode: 400,
        message: 'data not found ',
      });
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

exports.stateChange = async (req, res) => {
  try {
    const _id = req.params.id;
    if (Object.entries(req.body).length == 0) {
      return res.json({
        statusCode: 400,
        message: ' please fill the field status',
      });
    }
    const status = req.body.status;
    if (!['shipped', 'delivered'].includes(status)) {
      return res.json({
        statusCode: 400,
        message: 'status only have shipped and delivered',
      });
    }

    const orderFound = await Order.findOne({ _id });
    if (!orderFound) {
      return res.json({
        statusCode: 400,
        message: 'order not found ',
      });
    }
    const result = await Order.findByIdAndUpdate(
      { _id: _id },
      { status: req.body.status },
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

exports.deliverProduct = async (req, res) => {
  try {
    const _id = req.params.id;
    const orderData = await Order.findOne({ _id: _id });
    if (!orderData) {
      return res.json({
        statusCode: 400,
        message: 'order not found ',
      });
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
      return res.json({
        success: 400,
        message: 'wrong data',
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.changeDate = async (req, res) => {
  try {
    const date = req.params.date;
    const nextDate = new Date(+new Date() + 1 * 24 * 60 * 60 * 1000);
    if (date === 'fastDeliveryDate') {
      const fastDeliveryCharge = 40;
      const updateData = await Order.findOneAndUpdate(
        { userId: req.id },
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
        { userId: req.id },
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

      return res.json({
        statusCode: 200,
        data: orderData,
      });
    } else {
      return res.json({
        statusCode: 400,
        message: 'wrong data select',
      });
    }
  } catch (e) {
    console.log(e);
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};
