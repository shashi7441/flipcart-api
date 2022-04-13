const nodemailer = require('nodemailer');

exports.sendMail = async (element) => {
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
      to: element.email,
      subject: ' please verify your mail ',
      text: 'hii you registered your account and not verify your email account so please verify your mail',
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


// exports.createBrand = async (req, res) => {
//   try {
//     const { brand, image, public_id } = req.body;
//     const findData = await Brand.findOne({ brand: req.body.brand });
//     if (!findData) {
//       if (req.body) {
//         if (req.file) {
//           console.log('1111111111111111111111111111');
//           await uploadSingleImage(req, res);
//           console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>', req.my_url);
//           console.log(
//             '111111111111111111111111111111111111111',
//             req.my_cloudinaryId
//           );
//           const createDocument = await Brand({
//             brand,
//             createdBy: req.id,
//             public_id: req.my_cloudinaryId,
//             image: req.my_url,
//           });
//           const result = await createDocument.save();
//           return res.json({
//             success: true,
//             message: 'Brand created successful',
//             data: result,
//           });
//         } else {
//           const createDocument = await Brand({
//             brand,
//             createdBy: req.id,
//           });
//           const result = await createDocument.save();
//           return res.json({
//             success: true,
//             message: 'Brand created successful',
//             data: result,
//           });
//         }
//       }
//     } else {
//       res.json({
//         success: false,
//         message: 'brand already exist',
//       });
//     }
//   } catch (e) {
//     if (e.name === 'CastError') {
//       res.json({
//         success: false,
//         message:
//           'wrong objeact id plese write in this format(6244027080e1350cc114528b)',
//       });
//     }
//   }
// };

// exports.showBrand = async (req, res) => {
//   const result = await Brand.find({ createdBy: req.id });
//   res.json({
//     success: true,
//     data: result,
//   });
// };

// exports.updateBrand = async (req, res) => {
//   try {
//     console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11');
//     const _id = req.params.id;
//     const { brand } = req.body;
//     if (req.body) {
//       console.log('00000000000000000000000000000000000000');
//       console.log(req.file);
//       if (req.file) {
//         const dataFind = Brand.findOne({ _id });
//         if (!dataFind.image == null) {
//           console.log('111111111111111111111111111111111');
//           await cloudinary.uploader.destroy(dataFind.public_id, (result) => {
//             console.log(result);
//           });
//           await Brand.findByIdAndUpdate(
//             { _id },
//             { image: null, public_id: null },
//             { new: true }
//           );
//           await uploadSingleImage(req, res);

//           req.my_cloudinaryId;
//           req.my_url;
//           const dataUpdate = await Brand.updateOne(
//             { _id },
//             {
//               image: req.my_cloudinaryId,
//               public_id: req.my_url,
//             },
//             { new: true }
//           );

//           res.json({
//             success: true,
//             message: 'updated successfully',
//             data: dataUpdate,
//           });
//         } else {
//           console.log('22222222222222222222222222222222222');
//           console.log(req.body.brand);
//           await uploadSingleImage(req, res);
//           const BrandsUpdate = await Brand.findByIdAndUpdate(
//             { _id },
//             {
//               image: req.my_url,
//               public_id: req.my_cloudinaryId,
//               brand: req.body.brand,
//             },
//             {
//               new: true,
//             }
//           );
//           return res.json({
//             success: true,
//             message: 'brand updated successfully',
//             data: BrandsUpdate,
//           });
//         }
//       }
//     }
//   } catch (e) {
//     console.log(e);
//     res.json({
//       success: false,
//       data: e.message,
//     });
//   }
// };

// exports.deleteBrand = async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const dataResult = await Brand.findOne({ _id });
//     if (dataResult.isActive == true) {
//       console.log(dataResult.public_id);
//       await cloudinary.uploader.destroy(dataResult.public_id, (result) => {
//         console.log(result);
//       });

//       const result = await Brand.findByIdAndUpdate(
//         { _id },
//         { isActive: false, image: null, public_id: null },
//         { new: true }
//       );
//       return res.json({
//         success: true,
//         message: 'deleted successfully',
//         data: result,
//       });
//     } else {
//       res.json({
//         success: false,
//         data: 'brand already deleted',
//       });
//     }
//   } catch (e) {
//     res.json({
//       success: false,
//       data: e.message,
//     });
//   }
// };
