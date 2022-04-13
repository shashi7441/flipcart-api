const otpGenerator = require('otp-generator');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio');
const { userHtmlTemplate } = require('../utility/mailTemplate');
const { sellerPresent } = require('../service/userService');

const User = require('../models/user');
const { sendMail, Crypto_token, otp } = require('../service/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.userSignup = async (req, res) => {
  const find = await User.findOne({
    email: req.body.email,
  });
  // console.log("url", url);
  if (!find) {
    req.body.role = 'user';
    req.body.isApproved = true;
    // req.body. photo = url;
    const userToken = Crypto_token();
    console.log('token $%$%^&*(&^%', userToken);

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
    res.json({
      success: true,
      message: 'user register successful',
    });
  } else {
    res.json({
      success: false,
      message: ' user already exist',
    });
  }
};

//  ...........email login....................
userEmailLog = async (req, res) => {
  const userPresent = await sellerPresent(req, res);
  const result = await User.findOne({
    email: req.body.email,
  });
  const passwordMatch = await bcrypt.compare(
    req.body.password,
    result.password
  );
  
  console.log('result', result);

  if (userPresent != null) {
    console.log('infqwnnfhahfahfla', result.role);
    if (result.role === 'user') {
      if (result.isVerified === true) {
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
          message: 'you are not  verified ',
        });
      }
    } else {
      res.json({
        success: false,
        message: 'you are not user',
      });
    }
  } else {
    res.json({
      success: true,
      message: 'user not  found',
    });
  }
};

// ..................phone login.................
userPhoneLog = async (req, res) => {
  const userPresent = await sellerPresent(req, res);
  const result = await User.findOne({
    phone: req.body.phone,
    role: 'user',
  });
  if (result.otp === null) {
    otp(req, res, result);
  }
  const passwordMatch = await bcrypt.compare(
    req.body.password,
    result.password
  );
  console.log('result', result);
  if (userPresent != null) {
    if (result.role === 'user') {
      if (result.otp === 'true') {
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
        res.status(400).json({
          success: false,
          message: ' please verify otp',
        });
      }
    } else {
      res.json({
        success: false,
        message: 'you are not user',
      });
    }
  } else {
    res.json({
      success: true,
      message: 'user not  found',
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





// exports.forgetPassword = async (req, res) => {
//   try {
//       const email = req.body.email
//       const result = await Post.findOne({ email })
//       if (!result) {
//           notifier.notify("User not register")
//           return;
//       }
//       const secret = result.password
//       const payload = {
//           email: result.email,
//           id: result.id
//       }
//       const token = jwt.sign(payload, secret, { expiresIn: "5min" })

//       const link = `http://localhost:4600/resetpass/${result.id}/${token}`;
//       mailfunction(email, link)
//       res.send("Password reset link has been sent to your email...")
//       notifier.notify("Mail sent successfully")
//   } catch (error) {
//       console.log(error)
//   }


// }


// exports.updatePassword = async (req, res) => {
//   const { id } = req.params
//   try {
//       const password = req.body.password
//       let newPassword = password.toString();
//       const bcryptPassword = async (newPassword) => {
//           const pass = await bcrypt.hash(newPassword, 10)
//           return pass;
//       }
//       const response = await bcryptPassword(newPassword)
//       req.body.password = response;
//       const result = await Post.findByIdAndUpdate({ _id: id }, req.body, { new: true })
//       res.render("login")
//       notifier.notify("Password update successfully")
//   } catch (error) {
//       console.log(error)
//   }
// }


