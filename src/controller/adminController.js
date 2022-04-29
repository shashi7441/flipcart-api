const User = require('../models/user');
const { sendMail, fieldsVisible } = require('../service/adminService');
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Apierror } = require('../utility/error');

adminLogin = async (req, res, next) => {
  try {
    const result = await User.findOne({
      email: req.body.email,
    });
    if (!result) {
      return next(new Apierror('admin not found', 400));
    }
    if (!result.role == 'admin') {
      return next(new Apierror('you are not admin', 400));
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      result.password
    );
    if (!passwordMatch) {
      return next(new Apierror('Enter Correct Password', 409));
    }
    const jwtToken = await jwt.sign(
      { _id: result._id },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );
    return res.status(200).json({
      status: 200,
      message: 'Login Successfully ',
      data: jwtToken,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};
exports.sellerReject = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const userData = await User.findOne({ _id: _id, role: 'seller' });
    if (!userData) {
      return next(new Apierror('data not found', 400));
    }

    if (userData.isApproved == true) {
      const updatedData = await User.updateOne(
        { _id },
        { isApproved: false },
        { new: true }
      );
      return res.json({
        statusCode: 200,
        message: 'seller reject successfully',
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

exports.adminSignup = async (req, res) => {
  try {
    const find = await User.findOne({ role: 'admin' });
    if (find == null) {
      req.body.role = 'admin';
      req.body.isVerified = true;
      req.body.isApproved = true;
      req.body.otp = undefined;
      const createUser = await User(req.body);
      const result = await createUser.save();
      return res.json({
        statusCode: 200,
        message: 'admin register successful',
      });
    } else {
      adminLogin(req, res);
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.getAllSeller = async (req, res, next) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const fields = fieldsVisible(req);
    // console.log(fields);
    const find = await User.find({ role: 'seller', isApproved: false }, fields)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    if (!find) {
      return next(new Apierror('data not found', 400));
    }
    return res.json({
      statusCode: 200,
      data: find,
    });
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.routeCheck = (req, res, next) => {
  return next(new Apierror('page not found', 404));
  next();
};

exports.signupejs = (req, res) => {
  res.render('signup');
};

exports.dashBoardejs = (req, res) => {
  res.render('dashBoard');
};
