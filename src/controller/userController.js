require('dotenv').config();
const { userHtmlTemplate } = require('../utility/mailTemplate');
const User = require('../models/user');
const { sendMail, Crypto_token, otp } = require('../service/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Apierror } = require('../utility/error');

exports.userSignup = async (req, res) => {
  try {
    const find = await User.findOne({
      email: req.body.email,
      phone: req.body.phone,
    });
    if (find) {
      return next(new Apierror(' user already exist', 400));
    }

    if (!find) {
      req.body.role = 'user';
      req.body.isApproved = true;
      const userToken = Crypto_token();

      // ........... create User ................

      const createUser = await User(req.body);
      const result = await createUser.save();
      result.refreshToken = userToken;
      resultToken = result.refreshToken;
      const fullName = result.fullName;
      const link = `<br><a href="http://127.0.0.1:${process.env.PORT}/api/auth/user/verifytoken/${resultToken}">Click Here to Verify </a>`;
      if (req.body.email) {
        sendMail(req, res, resultToken, userHtmlTemplate(link, fullName));
      }
      return res.json({
        statusCode: 200,
        message: 'user register successful',
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

//  ...........email login....................
userEmailLog = async (req, res, next) => {
  try {
    const result = await User.findOne({
      email: req.body.email,
    });
    if (!result) {
      return next(new Apierror('user not  found please signup', 400));
    }
    if (!result.role === 'user') {
      return next(new Apierror('you are not user', 400));
    }
    if (!result.isVerified === true) {
      return next(new Apierror('you are not  verified ', 400));

    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      result.password
    );
    if (!passwordMatch) {
      return res.status(409).json({
        success: false,
        status: 409,
        message: 'Enter Correct Password',
      });
    }
    if (result.email) {
      const jwtToken = await jwt.sign(
        { _id: result._id },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
      );
      return res.status(200).json({
        success: true,
        status: 200,
        message: 'Login Successfully ',
        data: jwtToken,
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

// ..................phone login.................
userPhoneLog = async (req, res) => {
  try {
    const result = await User.findOne({
      phone: req.body.phone,
      role: 'user',
    });
    if (!result) {
      return res.json({
        statusCode: 400,
        message: 'user not found please signup',
      });
    }
    if (!result.role === 'user') {
      return res.json({
        statusCode: 400,
        message: 'you are not user',
      });
    }
    if (result.otp === null) {
      otp(req, res, result);
    }
    if (!result.otp === 'true') {
      return res.status(400).json({
        statusCode: 400,
        message: ' please verify otp',
      });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      result.password
    );
    if (!passwordMatch) {
      return res.status(409).json({
        success: false,
        status: 409,
        message: 'Enter Correct Password',
      });
    }
    if (result.phone) {
      const jwtToken = await jwt.sign(
        { _id: result._id },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
      );
      return res.status(200).json({
        success: true,
        status: 200,
        message: 'Login Successfully ',
        data: jwtToken,
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.userLogin = async (req, res, next) => {
  if (req.body.email) {
    userEmailLog(req, res, next);
  } else {
    userPhoneLog(req, res, next);
  }
};
