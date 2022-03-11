const nodemailer = require("nodemailer");
require("dotenv").config();
const { Seller } = require("../models");
const otpGenerator = require("otp-generator");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require("twilio");
const Otpvalid = require("../models/otpModel");

exports.login= async (req, res)=>{
  const email = req.body.email
  const phone = req.body.phone
  
}






(exports.checkEmail = async (req, res, next) => {
  const email = req.body.email;

  const user = await Seller.findOne({ email });
  if (user) {
    res.status(409).json({
      message: "email or phone no. already present",
      status: 409,
      success: false,
    });
  } else {
    next();
  }
}),
  (exports.sendMail = async (req, res) => {
    try {
      console.log("<><><>>>>>", req.result);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MY_MAIL,
          pass: process.env.MY_PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.MY_MAIL,
        to: req.result.email,
        subject: "Verify your mail",
        text: `Hey,it's our link to veriy the account and will going to expire in 10 mins `,
        html: `<br><a href="http://127.0.0.1:${process.env.PORT}/seller/verifytoken/${req.result.refreshToken}">Click Here to Verify </a> `,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    } catch (e) {
      console.log(e);
    }
  });

exports.otp = async (req, res,) => {
  try {
    const number = req.body.phone;
    console.log("<>>>>>>>>>>>>>>>>>>>>", number);

    if (number.length === 13 && number.slice(0, 3) === "+91") {
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

      const otpUser = await Otpvalid.create({ phone: number, otp: Otp });
      return otpUser;
    } 

    else {
      res.status(422).json({
        message: "invalid input; try this format '+916598563525' for contact",
      });
   
    }
   
  } catch (err) {
    console.log(err);
  }
};
