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
      res.json({
        success: false,
        message: 'invalid user',
      });
    }
    console.log('result in admin login api', result);
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
        res.status(200).json({
          success: true,
          status: 200,
          message: 'Login Successfully ',
          data: jwtToken,
        });
      } else {
        res.status(409).json({
          success: false,
          status: 409,
          message: 'Enter Correct Password  / you are not admin',
        });
      }
    } else {
      res.json({
        status: 400,
        message: 'you are not admin',
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
exports.sellerReject = async (req, res) => {
  try {
    const _id = req.params.id;
    const userData = await User.findOne({ _id: _id, role: 'seller' });
    if (!userData) {
      res.json({
        success: false,
        message: 'data not found',
      });
    }

    if (userData.isApproved == true) {
      const updatedData = await User.updateOne(
        { _id },
        { isApproved: false },
        { new: true }
      );
      res.json({
        success: true,
        message: 'updated successfully',
      });
    } else {
      res.json({
        success: false,
        message: 'wrong data',
      });
    }
  } catch (e) {
    res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.adminSignup = async (req, res) => {
  try {
    const find = await User.findOne({
      role: 'admin',
    });
    if (find == null) {
      req.body.role = 'admin';
      req.body.isVerified = true;
      req.body.isApproved = true;
      req.body.otp = undefined;
      const createUser = await User(req.body);
      const result = await createUser.save();
      res.json({
        success: true,
        message: 'user register successful',
      });
    } else {
      adminLogin(req, res);
    }
  } catch (e) {
    res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.getAllSeller = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const fields = fieldsVisible(req);
    // console.log(fields);
    const find = await User.find({ role: 'seller' }, fields)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: find,
    });
  } catch (e) {
    res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.routeCheck = (req, res, next) => {
  res.json({
    success: false,
    message: ' 404 Page Not Found ',
  });
  next();
};

exports.signupejs = (req, res) => {
  res.render('signup');
};

exports.dashBoardejs = (req, res) => {
  res.render('dashBoard');
};
