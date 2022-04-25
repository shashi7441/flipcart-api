var pdfkit = require('pdfkit');
const fs = require('fs');
const pdfDocument = new pdfkit();
const path = require('path');
const User = require('../models/user');
const {
  UserBindingContext,
} = require('twilio/lib/rest/chat/v2/service/user/userBinding');
const resultPath = path.join(__dirname, '/');

exports.acceptData = async (result) => {
  const userData = await User.findOne({ _id: result.userId });

  pdfDocument.pipe(fs.createWriteStream(`${resultPath}order.pdf`));
  pdfDocument.text(`hey ${userData.fullName}`).fontSize(60);
  pdfDocument.text(`orderId: ${result._id}`).fontSize(30);
  pdfDocument
    .text(`totalPriceWithShipingCharge: ${result.totalPriceWithShipingCharge}`)
    .fontSize(30);
  pdfDocument.text(`shippingcharge: ${result.shippingcharge}`).fontSize(30);
  pdfDocument.text(`totalPrice: ${result.totalPrice}`).fontSize(30);
  pdfDocument
    .text(`standardDeliveryTime: ${result.standardDeliveryTime}`)
    .fontSize(50);
  pdfDocument.text(`order status: ${result.status} `).fontSize(20);
  pdfDocument.text(`paymentMode:${result.paymentMode}`).fontSize(30);
  pdfDocument.end();
};
