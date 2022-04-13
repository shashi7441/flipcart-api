const crypto = require('crypto');
require('dotenv').config();
const User = require('../models/user');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio');
const jwt = require('jsonwebtoken');

//............ Generate crypto token...............
exports.Crypto_token = () => {
  return crypto.randomBytes(64).toString('hex');
};

// .............mail send...............
exports.sendMail = async (req, resultToken, userHtmlTemplate) => {
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
      html: userHtmlTemplate,
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
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (e) {
    console.log(e);
  }
};
// .............Verify Email..............

exports.userVerifiedEmail = async (req, res) => {
  try {
    const token = req.params.token;
    console.log('verify token', token);
    const user = await User.findOne({ refreshToken: token });
    const finalResult = user.refreshToken;
    if (token) {
      if (finalResult === token) {
        console.log('bhkhkwfhghew', user.isVerified);
        if (user.isVerified == false) {
          const update = await User.updateOne(
            { refreshToken: token },
            { isVerified: true }
          );
          console.log('44746><><<?>', update);
          res.json({
            message: 'Email verified successful',
            data: update,
            success: true,
          });
        } else {
          res.json({
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
    res.send(e);
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const contact = req.body.phone;
    const otp = req.body.otp;
    console.log('my otp is ', otp);
    const user = await User.findOne({ phone: contact });
    if (user) {
      if (user.role === 'user') {
        if (user.otp === otp) {
          await User.findOneAndUpdate({ phone: contact }, { otp: 'true' });
          res.status(200).json({
            message: 'user verfified successful',
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
          message: 'you are not user',
        });
      }
    } else {
      res.status(404).json({
        message: "user not found ; check input -'+91 before contact'",
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
    console.log('Number in Otp function', number);
    console.log('result in otp function', result);

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
  } catch (err) {
    console.log(err);
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
    return err;
  }
};

exports.userTokenVarify = (req, res, next) => {
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
        console.log('<<>>>>>>>>>>>>>>>>>>>>>', payload._id);
        req.body.userId = payload._id;
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