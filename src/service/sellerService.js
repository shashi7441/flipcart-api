const crypto = require('crypto');
require('dotenv').config();
const notifier = require('notifier');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio');
const { htmlTemplate } = require('../utility/mailTemplate');
const e = require('express');
//............ Generate crypto token...............
exports.Crypto_token = () => {
  return crypto.randomBytes(64).toString('hex');
};

// .............mail send...............
exports.sendMail = async (req, resultToken, htmlTemplate) => {
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
      html: htmlTemplate,
      // html: `<br><a href="http://127.0.0.1:${process.env.PORT}/auth/seller/verifytoken/${resultToken}">Click Here to Verify </a> `,
      attachments: [
        {
          filename: 'handshake.png',
          path: 'https://www.quickanddirtytips.com/sites/default/files/images/4472/handshake.jpg',
          cid: 'handshake',
        },
      ],
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({
          statusCode: 400,
          message: error.message,
        });
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};
// .............Verify Email..............
exports.verifiedEmail = async (req, res) => {
  try {
    const token = req.params.token;
    console.log('verify token', token);
    const user = await User.findOne({ refreshToken: token });
    const finalResult = user.refreshToken;
    if (token) {
      if (finalResult === token) {
        if (user.isVerified == false) {
          const update = await User.updateOne(
            { refreshToken: token },
            { isVerified: true }
          );
          console.log('44746><><<?>', update);
          return res.json({
            message: 'Email verified successful !! wait for admin approvel',
            data: update,
            statusCode: 200,
          });
        } else {
          return res.json({
            success: false,
            message: 'already verified',
          });
        }
      } else {
        res.send('token are not match');
      }
    } else {
      res.send('token not found');
    }
  } catch (e) {
    res.json({
      success: false,
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const contact = req.body.phone;
    const otp = req.body.otp;
    console.log('my otp is ', otp);
    const user = await User.findOne({ phone: contact });
    const currentTime = Date.now();
    if (user) {
      if (user.role === 'seller') {
        if (user.resetTime >= currentTime) {
          if (user.otp === otp) {
            await User.findOneAndUpdate({ phone: contact }, { otp: 'true' });
            res.status(200).json({
              message:
                'seller verfified successfull !! wait for admins approval',
              status: 200,
              success: true,
            });
          } else {
            res.status(401).json({
              message: 'invalid otp',
              status: 401,
              success: false,
            });
          }
        } else {
          res.json({
            success: false,
            message: 'your otp will be expire',
          });
        }
      } else {
        res.json({
          success: false,
          message: 'you are not seller',
        });
      }
    } else {
      res.status(404).json({
        message: 'user not found',
        status: 404,
        success: false,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.otp = async (req, res, result) => {
  try {
    const number = req.body.phone;
    // console.log('Number in Otp function', number);
    // console.log('result in otp function', result);

    if (number.length === 13 && number.slice(0, 3) === '+91') {
      const client = await new twilio(accountSid, authToken);
      const Otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      await client.messages.create({
        body: `your verification code is : ${Otp} and will expires in 10 min`,
        to: number,
        from: process.env.MY_NUMBER,
      });

      const otpUser = await User.updateOne(
        { _id: result._id },
        { otp: Otp, expiresIn: Date.now() + 10 * 60000 }
      );
      return otpUser;
    } else {
      res.json({
        message: "invalid input; try this format '+916598563525' for contact",
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.sellerPresent = async (req) => {
  try {
    if (req.body.email) {
      const user = await User.findOne({ email: req.body.email });
      return user;
    } else {
      const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
      return user;
    }
  } catch (err) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

mailfunction = async (email, link) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MY_MAIL,
      pass: MY_PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.MY_MAIL,
    to: req.body.email,
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

exports.updatePassword = async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  try {
    const newPassword = req.body.password;
    // let newPassword = password.toString();
    const bcryptPassword = async (newPassword) => {
      const pass = await bcrypt.hash(newPassword, 10);
      return pass;
    };
    const response = await bcryptPassword(newPassword);
    // req.body.password = response;
    const result = await User.updateOne(
      { _id: _id },
      { password: response },
      { new: true }
    );
    // notifier.notify("Password update successfully")
    return res.json({
      success: true,
      statusCode: 200,
      message: 'password uppdated successfully',
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};
