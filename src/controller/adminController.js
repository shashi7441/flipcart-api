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
    if (result == null) {
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
        console.log('in login function', jwtToken);

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
    console.log(error);
  }
};

exports.adminSignup = async (req, res) => {
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
};

exports.getAllSeller = async (req, res) => {
  var page = req.query.page;
  var size = req.query.size;
  console.log(size);
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 2;
  }
  const fields = fieldsVisible(req);
  // console.log(fields);
  const find = await User.find({ role: 'seller' })
    .limit(size)
    .sort({ createdAt: -1 });
  res.json({
    success: true,
    data: find,
  });
};

exports.routeCheck = (req, res, next) => {
  res.json({
    success: false,
    message: '!....... 404.........Page Not Found...............! ',
  });
  next();
};

exports.signupejs = (req, res) => {
  res.render('signup');
};



exports.dashBoardejs = (req, res) => {
  res.render('dashBoard');
};
