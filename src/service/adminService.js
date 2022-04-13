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
    console.log(e);
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
    console.log(e);
  }
};

exports.TokenVarify = (req, res, next) => {
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
    jwt.verify(token, process.env_SECRET_KEY,(error, payload) => {
      if (payload) {
        console.log('<<>>>>>>>>>>>>>>>>>>>>>', payload._id);
        req._id = payload._id;

        next();
      } else {
        return res.status(400).json({
          success: false,
          data: error,
        });
      }
    });
  }
};

exports.adminAprovel = async (req, res) => {
  const id = req.body._id;
  console.log('id', id);
  const users = await User.findOne({ _id: id });
  console.log('in admin aprovel user is', users);
  if (!users) {
    res.status(400).json({
      success: false,
      message: 'invalid user',
    });
  } else if (users.isAprroved == true && users.role === 'seller') {
    res.send('seller already verified');
  } else {
    if (users.role === 'seller' && users.isApproved == false) {
      const result = await User.updateOne(
        { _id: users._id },
        { isApproved: true },
        { new: true }
      );
      // console.log(result);
      res.json({
        success: true,
        message: 'approved by admin',
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
      res.json({
        success: false,
        message: 'Seller not found',
      });
    }
  }
};

exports.fieldsVisible = (req) => {
  if (req.query.fields) {
    const arr = req.query.fields.split(',');
    // console.log('in', arr);
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

exports.sellerTokenVarify = (req, res, next) => {
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
    jwt.verify(token, process.env.SECRET_KEY, (error, payload) => {
      if (payload) {
        // console.log("<<>>>>>>>>>>>>>>>>>id >>>>",payload._id);
        req.id = payload._id;
        // console.log();
        next();
      } else {
        return res.status(400).json({
          success: false,
          message:"Invalid token",
          data: error.message,
        });
      }
    });
  }
};
