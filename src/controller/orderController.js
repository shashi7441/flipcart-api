const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const Address = require('../models/address');
const { createAddressForOrder } = require('../controller/addressController');
exports.order = async (req, res) => {
  try {
    const { userId, addressId, productId, quantity } = req.body;
    const userData = await User.findOne({ _id: req.id });
    const productData = await Product.findOne({ _id: productId });
    const addressData = await Address.findOne(
      { _id: req.body.addressId },
      { isDefault: true },
      { userId: req.id }
    );
    if (!userData) {
      return res.json({
        success: false,
        message: 'invalid user',
      });
    }

    if (!productData) {
      return res.json({
        success: false,
        message: 'product not found',
      });
    }
    const productQuantity = productData.quantity;
    if (quantity > productQuantity) {
      return res.json({
        success: false,
        message: 'product out of stock',
      });
    }
    const totalAmount = quantity * productData.price;

    if (!addressData) {
      return res.json({
        success: false,
        message: 'address not found',
      });
    }
    const createOrder = await Order({
      userId: req.id,
      productId,
      status: 'ordered',
      addressId,
    });
    const result = await createOrder.save();
    req.orderId = result._id;
    // console.log(">>>>>>>>>>>>",result._id);
    return res.json({
      success: true,
      message: 'order placed successfull',
      totalAmount: totalAmount,
      data: result,
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const _id = req.params.id;
    const data = await Order.findByIdAndUpdate(
      { _id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!data) {
      return res.json({
        success: false,
        message: 'data not found',
      });
    }
    return res.json({
      success: true,
      message: 'order cancelled successfully',
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.showOneOrder = async (req, res) => {
  try {
    const _id = req.params.id;
    const orderFound = await Order.findOne({ _id }, { userId: req.id })
      .populate('userId', 'fullName phone')
      .populate('productId', 'price title services')
      .populate('addressId', 'country state city pincode');
    if (!orderFound) {
      return res.json({
        success: false,
        message: 'data not found ',
      });
    } else {
      return res.json({
        success: true,
        data: orderFound,
      });
    }
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.showAllOrder = async (req, res) => {
  try {
    const orderFound = await Order.find({ userId: req.id })
      .populate('userId', 'fullName phone')
      .populate('productId', 'price title services')
      .populate('addressId', 'country state city pincode');

    if (!orderFound) {
      return res.json({
        success: false,
        message: 'order not found',
      });
    } else {
      return res.json({
        success: true,
        totalOrder: orderFound.length,
        data: orderFound,
      });
    }
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.stateChange = async (req, res) => {
  try {
    const _id = req.params.id;
    if (Object.entries(req.body).length == 0) {
      return res.json({
        success: false,
        message: ' please fill the field status',
      });
    }
    const status = req.body.status;
    if (!['shipped', 'delivered'].includes(status)) {
      return res.json({
        success: false,
        message: 'status only have shipped and delivered',
      });
    }

    const orderFound = await Order.findOne({ _id });
    if (!orderFound) {
      return res.json({
        success: false,
        message: 'order not found ',
      });
    }
    const result = await Order.findByIdAndUpdate(
      { _id: _id },
      { status: req.body.status },
      { new: true }
    );
    return res.json({
      success: true,
      message: 'status updated successfully',
      data: result,
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};
