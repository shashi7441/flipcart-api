require('dotenv').config();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.fileAndBodyAccept = (req, res, next) => {
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.fieldname + path.extname(file.originalname));
    },
  });
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg'
      ) {
        cb(null, true);
      } else {
        // cb(null, false);
        // return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        res.json({
          success: false,
          message:
            '!.......... wrong file upload....... only png , jpg , jpeg file is accepted',
        });
      }
    },
    limits: { fileSize: 1024 * 1024 },
  }).array('image', 5);
  upload(req, res, (e) => {
    if (e) {
      return res.json({
        success: false,
        data: e.message,
      });
    }
    const array = [];
    if (req.files) {
      if (req.files.length > 0) {
        for (file of req.files) {
          if (array.includes(file.originalname) === false) {
            array.push(file.originalname);
          } else {
            return res.json({
              success: false,
              message: 'same file are not allowed',
            });
          }
        }
      }
    }
    req.files = req.file || req.files;
    req.body = req.body;

    next();
  });
};


exports.uploadImges = async (req, res) => {
  const urls = [];
  for (let file of req.files) {
    const { path } = file;
    await cloudinary.uploader.upload(
      `${path}`,
      { folder: 'reviewPic' },
      (e, result) => {
        // console.log(result, e);
        const { url, public_id } = result;
        const newPush = {};
        // console.log('result', result);
        newPush.url = url;
        newPush.public_id = public_id;
        urls.push(newPush);
        // console.log(newPush);;
      }
    );
  }
  req.images = urls;
};

exports.uploadImagesForProduct = async (req, res) => {
  const urls = [];
  for (let file of req.files) {
    const { path } = file;
    await cloudinary.uploader.upload(
      `${path}`,
      { folder: 'productPic' },
      (e, result) => {
        const { url, public_id } = result;
        const newPush = {};
        // console.log('result', result);
        newPush.url = url;
        newPush.public_id = public_id;
        urls.push(newPush);
        // console.log(newPush);;
      }
    );
  }
  req.images = urls;
};
exports.uploadImagesForCategory = async (req, res) => {
  const urls = [];
  for (let file of req.files) {
    const { path } = file;
    await cloudinary.uploader.upload(
      `${path}`,
      { folder: 'categoryPic' },
      (e, result) => {
       if(e){
         return res.json({
          success:false,
          message:e.message
         })
       }
        const { url, public_id } = result;
        const newPush = {};
        // console.log('result', result);
        newPush.url = url;
        newPush.public_id = public_id;
        urls.push(newPush);
        // console.log(newPush);;
      }
    );
  }
  req.images = urls;
};
exports.uploadImagesForBrand = async (req, res) => {
  const urls = [];
  for (let file of req.files) {
    const { path } = file;
    await cloudinary.uploader.upload(
      `${path}`,
      { folder: 'brandPic' },
      (e, result) => {
        // console.log(result, e);
        const { url, public_id } = result;
        const newPush = {};
        // console.log('result', result);
        newPush.url = url;
        newPush.public_id = public_id;
        urls.push(newPush);
        // console.log(newPush);;
      }
    );
  }
  req.images = urls;
};
