const nodeCron = require('node-cron');
const { sendMail } = require('../shared/shared');
const User = require('../models/user');

exports.mailSendEvery = async (req, res) => {
  try {
    const userData = await User.find({ role: 'user', isVerified: false });
    // console.log("hiiiiiiiiiiiiii",findData);

    userData.map((element) => {
      console.log('0000000000000000000000000', i);
        sendMail(element)  
    });
  } catch (e) {
    res.json({
      success: false,
      data: e.message,
    });
  }
};










