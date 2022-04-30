require('dotenv').config();
const User = require('../models/user');
const { sendMail, Crypto_token, otp } = require('../service/sellerService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { htmlTemplate } = require('../utility/mailTemplate');
const { Apierror } = require('../utility/error');

exports.signup = async (req, res, next) => {
  try {
    const { email, fullName, phone, password } = req.body;
    const find = await User.findOne({ email: email, phone: phone });
    if (find) {
      return next(new Apierror(`${email} , ${phone}already exist`, 400));
    }
const timeAfterTenMinute = Date.now() + 10 * 60000
    if (!find) {
      const token = Crypto_token();
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt) 
      const createUser = await User({
        role:'seller',
        password:hash,
        fullName:fullName,
        email:email,
        phone:phone,
        refreshToken:token,
        resetTime : timeAfterTenMinute
      });
      const result = await createUser.save();
      const fullname = result.fullName;
      resultToken = result.refreshToken;
      if (email) {
        const link = `<br><a href="http://127.0.0.1:${process.env.PORT}/api/auth/seller/verifytoken/${resultToken}">Click Here to Verify </a> `;
        await sendMail(req, res, resultToken, htmlTemplate(link, fullname));
      }

      return res.json({
        statusCode: 200,
        message: 'seller register successful',
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
sellerEmaillog = async (req, res, next) => {
  try {
    const{email} = req.body
    const result = await User.findOne({
      email: email,
    });
    if (!result) {
      return next(new Apierror('data not found please signup', 400));
    }
    if (!result.role == 'seller') {
      return next(new Apierror('you are not seller', 400));
    }
    if (!result.isVerified === true) {
      return next(new Apierror('you are not  verified ', 400));
    }
    if (!result.isApproved === true) {
      return next(
        new Apierror(
          'you are not approved by admin so not login please approve by admin ',
          400
        )
      );
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      result.password
    );
    if (!passwordMatch) {
      return next(new Apierror('Enter Correct Password', 409));
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
sellerPhoneLog = async (req, res, next) => {
  try {
    const{phone} = req.body
    const result = await User.findOne({
      phone: phone,
      role: 'seller',
    });
    if (!result) {
      return next(new Apierror('seller not found please signup', 400));
    }
    if (result.otp === null) {
      await otp(req, res, result);
    }

    if (!result.role === 'seller') {
      return next(new Apierror('you are not seller', 400));
    }
    if (!result.isVerified === true) {
      return next(new Apierror('please verify your email', 400));
    }
    if (result.isApproved === false) {
      return next(
        new Apierror(
          'you are not approved by admin so not login please approve by admin ',
          400
        )
      );
    }
    if (!result.otp == 'true') {
      return next(new Apierror(' please verify otp', 400));
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      result.password
    );
    if (!passwordMatch) {
      return next(new Apierror('Enter Correct Password', 409));
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

exports.login = async (req, res, next) => {
  if (req.body.email) {
    sellerEmaillog(req, res, next);
  } else {
    sellerPhoneLog(req, res, next);
  }
};
