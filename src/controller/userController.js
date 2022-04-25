const otpGenerator = require('otp-generator');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio');
const { userHtmlTemplate } = require('../utility/mailTemplate');
const User = require('../models/user');
const { sendMail, Crypto_token, otp } = require('../service/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.userSignup = async (req, res) => {
  try {
    const find = await User.findOne({
      email: req.body.email,
    });

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
        sendMail(req, resultToken, userHtmlTemplate(link, fullName));
      }
      return res.json({
        statusCode: 200,
        message: 'user register successful',
      });
    } else {
      return res.json({
        statusCode: 400,
        message: ' user already exist',
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
userEmailLog = async (req, res) => {
  try {
    const result = await User.findOne({
      email: req.body.email,
    });
    if (!result) {
      return res.json({
        statusCode: 400,
        message: 'user not  found please signup',
      });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      result.password
    );
    if (result.role === 'user') {
      if (result.isVerified === true) {
        if (passwordMatch) {
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
        } else {
          return res.status(409).json({
            success: false,
            status: 409,
            message: 'Enter Correct Password',
          });
        }
      } else {
        return res.json({
          statusCode: 400,
          message: 'you are not  verified ',
        });
      }
    } else {
      return res.json({
        statusCode: 400,
        message: 'you are not user',
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

    if (result.otp === null) {
      otp(req, res, result);
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      result.password
    );
    if (result.role === 'user') {
      if (result.otp === 'true') {
        if (passwordMatch) {
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
        } else {
          return res.status(409).json({
            success: false,
            status: 409,
            message: 'Enter Correct Password',
          });
        }
      } else {
        return res.status(400).json({
          statusCode: 400,
          message: ' please verify otp',
        });
      }
    } else {
      return res.json({
        statusCode: 400,
        message: 'you are not user',
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.userLogin = async (req, res) => {
  if (req.body.email) {
    userEmailLog(req, res);
  } else {
    userPhoneLog(req, res);
  }
};
