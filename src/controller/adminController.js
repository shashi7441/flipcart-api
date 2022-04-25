const User = require('../models/user');

const { sendMail, fieldsVisible } = require('../service/adminService');
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

adminLogin = async (req, res) => {
  try {
    const result = await User.findOne({
      email: req.body.email,
    });
    if (!result) {
      return res.json({
        statusCode:400,
        message: 'admin not found',
      });
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      result.password
    );
    if (result.role == 'admin') {
      if (passwordMatch) {
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
      } else {
        return res.status(409).json({
          status: 409,
          message: 'Enter Correct Password',
        });
      }
    } else {
      return res.json({
        status: 400,
        message: 'you are not admin',
      });
    }
  } catch (error) {
    return res.json({
      statusCode:400,
      message: error.message,
    });
  }
};
exports.sellerReject = async (req, res) => {
  try {
    const _id = req.params.id;
    const userData = await User.findOne({ _id: _id, role: 'seller' });
    if (!userData) {
      return res.json({
        statusCode:400,
        message: 'data not found',
      });
    }

    if (userData.isApproved == true) {
      const updatedData = await User.updateOne(
        { _id },
        { isApproved: false },
        { new: true }
      );
      return res.json({
        statusCode:200,
        message: 'seller reject successfully',
      });
    } else {
      return res.json({
        statusCode:400,
        message: 'wrong data',
      });
    }
  } catch (e) {
    return res.json({
      statusCode:400,
      message: e.message,
    });
  }
};

exports.adminSignup = async (req, res) => {
  try {
    const find = await User.findOne({ role: 'admin' });
    console.log(find);
    if (find == null) {
      req.body.role = 'admin';
      req.body.isVerified = true;
      req.body.isApproved = true;
      req.body.otp = undefined;
      const createUser = await User(req.body);
      const result = await createUser.save();
      return res.json({
        statusCode:200,
        message: 'admin register successful',
      });
    } else {
      adminLogin(req, res);
    }
  } catch (e) {
    return res.json({
      statusCode:400,
      message: e.message,
    });
  }
};

exports.getAllSeller = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const fields = fieldsVisible(req);
    // console.log(fields);
    const find = await User.find({ role: 'seller', isApproved: false }, fields)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    res.json({
      statusCode:200,
      data: find,
    });
  } catch (e) {
 return   res.json({
  statusCode:400,
      message: e.message,
    });
  }
};

exports.routeCheck = (req, res, next) => {
  res.json({
    statusCode:404,
    message: 'Page Not Found ',
  });
  next();
};

exports.signupejs = (req, res) => {
  res.render('signup');
};

exports.dashBoardejs = (req, res) => {
  res.render('dashBoard');
};
