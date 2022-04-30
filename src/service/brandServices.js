const Photo = require('../models/image');
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.createBrandPhoto = async (req, res) => {
  try {
    const create = await Photo({
      image: req.images,
      brandId: req.brandId,
    });

    const result = await create.save();
    req.results = result;
  } catch (e) {
    return res.json({
      success: false,
      statusCode:400,
      data: e.message,
    });
  }
};

exports.deleteBrandPhoto = async (req, res) => {
  try {
   
    const testId = req.deleteImageId;
    let user = await Photo.findOne({ _id: testId });
   
    const data = user.image;
  

    data.map(async (i) => {
     
      await cloudinary.uploader.destroy(i.public_id);
    });

    user.remove();
  } catch (e) {
    return res.json({
      statusCode:400,
      message: e.message,
    });
  }
};

exports.createAndUpdateBrandPhoto = async (req, res) => {
  try {
    const create = await Photo({
      image:  req.images ,
      brandId: req.brand_Id,
    });
    const result = await create.save();
  
    req.photo_id = result._id;
  } catch (e) {
    res.json({
      statusCode:400,
      message:e.message
    })
   
  return  res.json({
      success: false,
      statusCode:400,
      data: e.message,
    });
  }
};

exports.updateBrandPhoto = async (req, res) => {
  try {
    const id = req.updateImageId;
    const data = await Photo.findOne({ _id: id });
    const dataImage = data.image;
    dataImage.map(async (i) => {
      await cloudinary.uploader.destroy(i.public_id);
    });
    const urls = [];
    for (let file of req.files) {
      const { path } = file;
      await cloudinary.uploader.upload(`${path}`, (result, e) => {
        const { url, public_id } = result;
        const newPush = {};
        newPush.url = url;
        newPush.public_id = public_id;
        urls.push(newPush);
        req.urls = urls;
  
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
  } catch (e) {
   return res.json({
    statusCode:400,
      message: e.message,
    });
  }
};
