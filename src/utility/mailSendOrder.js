const path = require('path');
require('dotenv').config();
const nodemailer = require('nodemailer');

const User = require('../models/user');
const resultPath = path.resolve(__dirname, '../utility/');

exports.sendMailToOrder = async (req, res, result) => {
  try {
    const userData = await User.findOne({ _id: result.userId });
    const email = userData.email;
    console.log('>>>>>>>>>', email);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_MAIL,
        pass: process.env.MY_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.MY_MAIL,
      to: email,
      subject: 'Verify your mail',
      test: `Hey,it's our link to veriy the account and will going to expire in 10 mins `,
      attachments: [
        {
          filename: 'order.pdf',
          contentType: 'application/pdf',
          path: `${resultPath}/output.pdf`,
        },
      ],
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
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
