const crypto = require('crypto');
require('dotenv').config();
const User = require('../models/user');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { approvelMailTemplate } = require('../utility/mailTemplate');
//............ Generate crypto token...............
exports.Crypto_token = () => {
  return crypto
    .createHash('sha256')
    .update('Man oh man do I love node!')
    .digest('hex');
  {
    expiresIn: '10m';
  }
};

sellerverifyMail = async (users, approvelMailTemplate) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_MAIL,
        pass: process.env.MY_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.MY_MAIL,
      to: users.email,
      subject: 'hii you approved by admin',
      html: approvelMailTemplate,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

// .............mail send...............
exports.sendMail = async (req, resultToken) => {
  try {
    console.log('<><><>>>>>', resultToken);
    console.log(process.env.MY_MAIL, process.env.MY_PASSWORD);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_MAIL,
        pass: process.env.MY_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.MY_MAIL,
      to: req.body.email,
      subject: 'Verify your mail',
      text: `Hey,it's our link to veriy the account and will going to expire in 10 mins `,
      html: `<br><a href="http://127.0.0.1:${process.env.PORT}/auth/admin/verifytoken/${resultToken}">Click Here to Verify </a> `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.adminAprovel = async (req, res) => {
  try {
    const id = req.body._id;
    const users = await User.findOne({ _id: id });
    if (!users) {
      return res.status(400).json({
        success: false,
        message: 'data not found',
      });
    } else if (users.isAprroved == true && users.role === 'seller') {
      res.json({
        success: 400,
        message: 'already approved',
      });
    } else {
      if (users.role === 'seller' && users.isApproved == false) {
        const result = await User.updateOne(
          { _id: users._id },
          { isApproved: true },
          { new: true }
        );
        res.json({
          success: 400,
          message: `${users.role} ${users.fullName} approved by admin`,
          data: result,
        });

        // console.log('user.isaghhh54477654757874543', result);
        const sellerFullName = users.fullName;
        if (result.acknowledged === true) {
          if (users.email) {
            sellerverifyMail(users, approvelMailTemplate(sellerFullName));
          }
        }
      } else {
        return res.json({
          success: false,
          message: 'Seller not found',
        });
      }
    }
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

exports.fieldsVisible = (req) => {
  if (req.query.fields) {
    const arr = req.query.fields.split(',');
    let fields = {};
    arr.map((i) => {
      fields[i] = 1;
    });
    return fields;
  } else {
    const fields = {
      role: 1,
      fullName: 1,
      email: 1,
      phoneNumber: 1,
      isVerified: 1,
      isApprove: 1,
    };
    return fields;
  }
};
// approvelMailTemplate(sellerFullName)

exports.sellerTokenVarify = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({
        message: 'A token is required for authentication',
        status: 400,
        success: false,
      });
    } else {
      const authHeader = req.headers.authorization;
      const bearerToken = authHeader.split(' ');
      const token = bearerToken[1];
      jwt.verify(token, process.env.SECRET_KEY, async (error, payload) => {
        if (payload) {
          req.id = payload._id;
          const data = await User.findOne({ _id: req.id });
          req.userData = data;

          next();
        } else {
          return res.status(400).json({
            success: false,
            message: 'Invalid token',
            data: error.message,
          });
        }
      });
    }
  } catch (e) {
    return res.json({
      success: false,
      statusCode: 400,
      message: e.message,
    });
  }
};
