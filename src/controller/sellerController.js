require('dotenv').config();
const otpGenerator = require('otp-generator');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio');
const { sellerPresent } = require('../service/sellerService');
const User = require('../models/user');
const { sendMail, Crypto_token, otp } = require('../service/sellerService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { htmlTemplate } = require('../utility/mailTemplate');
exports.signup = async (req, res) => {
  try {
    const find = await User.findOne({
      email: req.body.email,
    });
    if (!find) {
      req.body.role = 'seller';
      const token = Crypto_token();
      const createUser = await User(req.body);
      const result = await createUser.save();
      const fullname = result.fullName;
      result.refreshToken = token;
      resultToken = result.refreshToken;
      if (req.body.email) {
        const link = `<br><a href="http://127.0.0.1:${process.env.PORT}/api/auth/seller/verifytoken/${resultToken}">Click Here to Verify </a> `;
        sendMail(req, resultToken, htmlTemplate(link, fullname));
      }

      return res.json({
        success: true,
        message: 'user register successful',
      });
    } else {
      res.json({
        success: false,
        message: ' user already exist',
      });
    }
  } catch (e) {
    res.json({
      success: false,
      message: e.message,
    });
  }
};

//  ...........email login....................
sellerEmaillog = async (req, res) => {
  try {
    const result = await User.findOne({
      email: req.body.email,
    });
    if (!result) {
      res.json({
        success: false,
        message: 'data not found please signup',
      });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      result.password
    );
      if (result.role == 'seller') {
        if (result.isVerified === true) {
          if (result.isApproved === true) {
            if (passwordMatch) {
              if (result.email) {
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
              }
            } else {
              res.status(409).json({
                success: false,
                status: 409,
                message: 'Enter Correct Password',
              });
            }
          } else {
            res.json({
              success: false,
              message:
                'you are not approved by admin so not login please approve by admin ',
            });
          }
        } else {
          res.json({
            success: false,
            message: 'you are not  verified ',
          });
        }
      } else {
        res.json({
          success: false,
          message: 'you are not seller',
        });
      }
   
  } catch (e) {
    res.json({
      success: false,
      message: e.message,
    });
  }
};

// ..................phone login.................
sellerPhoneLog = async (req, res) => {
  try {
    const result = await User.findOne({
      phone: req.body.phone,
      role: 'seller',
    });
    if (!result) {
      res.json({
        success: false,
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
      if (result.role === 'seller') {
        if (result.isVerified === true) {
          if (result.otp === 'true') {
            if (result.isApproved === true) {
              if (passwordMatch) {
                if (result.phone) {
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
                }
              } else {
                res.status(409).json({
                  success: false,
                  status: 409,
                  message: 'Enter Correct Password',
                });
              }
            } else {
              res.json({
                success: false,
                message:
                  'you are not approved by admin so not login please approve by admin ',
              });
            }
          } else {
            res.status(400).json({
              success: false,
              message: ' please verify otp',
            });
          }
        } else {
          res.status(400).json({
            success: false,
            message: 'please verify your email',
          });
        }
      } else {
        res.json({
          success: false,
          message: 'you are not seller',
        });
      }
    
  } catch (e) {
    res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.login = async (req, res) => {
  if (req.body.email) {
    console.log('hiiiiiiiii');
    sellerEmaillog(req, res);
  } else {
    sellerPhoneLog(req, res);
  }
};
