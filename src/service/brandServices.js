const Photo = require('../models/image');
const cloudinary = require('cloudinary');


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// exports.createSinglePhoto = async (req, res)=>{
//  try{
//     await uploadSingleImage(req, res, next)
//  }catch(e){
//   res.json({
//       success:false,
//       data:e.message
//   })
//  }
// }

// exports.deleteSinglePhoto = async (req, res)=>{
// //    await cloudinary.uploader.destroy( , (result, error)=>{
// //        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>",result);
// //        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", error );
// //    });
// }

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.createBrandPhoto = async (req, res) => {
  try {
    console.log('hiiiiiiiiiiiiiiiiiiiiii', req.singleImage);
    const create = await Photo({
      image: req.singleImage,
      brandId: req.brandId,
    });

    const result = await create.save();
    req.results = result;
  } catch (e) {
    res.json({
      success: false,
      data: e.message,
    });
  }
};

exports.deleteBrandPhoto = async (req, res) => {
  try {
    console.log('hiiiiiiiiiiiiiiiiiiiiiiii');
    const testId = req.deleteImageId;
    let user = await Photo.findOne({ _id: testId });
    console.log('<<<<<<<<<<<<<,,', user);
    const data = user.image;
    console.log('>>>>>>>>>>>>>>>>>>', data);

    data.map(async (i) => {
      console.log('in id', i.public_id);
      await cloudinary.uploader.destroy(i.public_id);
    });

    user.remove();
  } catch (e) {}
};

exports.createAndUpdateBrandPhoto = async (req, res) => {
  try {
    const create = await Photo({
      image: req.singleImage,
      brandId: req.brand_Id,
    });
    const result = await create.save();
    console.log('res111111111111111111', result._id);
    req.photo_id = result._id;
  } catch (e) {
    console.log('................', e);
    res.json({
      success: false,
      data: e.message,
    });
  }
};

exports.updateBrandPhoto = async (req, res) => {
  console.log('shsashifdf');

  const id = req.updateImageId;
  const data = await Photo.findOne({ _id: id });
  console.log('in update photo', data);
  const dataImage = data.image;
  dataImage.map(async (i) => {
    await cloudinary.uploader.destroy(i.public_id);
    // console.log(i.public_id);
  });
  console.log('>????????????????????', req.files);
  const urls = [];
  for (let file of req.files) {
    const { path } = file;
    await cloudinary.uploader.upload(`${path}`, (result, e) => {
      // console.log("errrrr", e);
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>.",result);
      const { url, public_id } = result;
      const newPush = {};
      // console.log('result', result);
      newPush.url = url;
      newPush.public_id = public_id;
      urls.push(newPush);
      req.urls = urls;
      // console.log(url);
    });
    const updateImage = await Photo.updateOne(
      { _id: id },
      {
        image: req.urls,
      },
      {
        new: true,
      }
    );
  }
};


