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

// ..........single image accept...................
exports.fileAndBodyAcceptForSingleImage = (req, res, next) => {
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
  }).array('image', 1);
  upload(req, res, (e) => {
    if (e) {
      res.json({
        success: false,
        data: e.message,
      });
      req.files = req.file || req.files;
    }
    next();
  });
};

exports.uploadSingleImage = async (req, res) => {
  try {
    // const file = req.files;
    // console.log(req.file);
    const path = req.files.path;
    // console.log('path', path);
    const fileName = req.files.filename;

    for (let file of req.files) {
      const urls = [];
      const { path } = file;
      console.log("path",path);
      await cloudinary.uploader.upload(path, (e, result) => {
        console.log('1000000000000000000', result);
        const { url, public_id } = result;
        const newPush = {};
        // console.log('result', result);
        newPush.url = url;
        newPush.public_id = public_id;
        urls.push(newPush);
        req.singleImage = urls
      });
    }

  } catch (e) {
    res.json({
      success: false,
      data: e.message,
    });
    console.log(e);
  }
};

// exports.uploadSingleImage = async (req, res) => {
//   try {
//     const file = req.file;
//     // console.log(req.file);
//     const path = req.file.path;
//     // console.log('path', path);
//     const fileName = req.file.filename;
//     await cloudinary.uploader.upload(`${path}`, (e, result) => {
//       req.my_cloudinaryId = result.public_id;
//       // console.log(req.cloudinaryId);
//       req.my_url = result.url;
//       // console.log(req.url);
//       // console.log('error', e);
//     });
//   } catch (e) {
//     res.json({
//       success: false,
//       data: e.message,
//     });
//     console.log(e);
//   }
// };

// ............ upload multiple images........................

exports.uploadImges = async (req, res) => {
  const urls = [];
  for (let file of req.files) {
    const { path } = file;
    await cloudinary.uploader.upload(`${path}`, (e, result) => {
      // console.log(result, e);
      const { url, public_id } = result;
      const newPush = {};
      // console.log('result', result);
      newPush.url = url;
      newPush.public_id = public_id;
      urls.push(newPush);
      // console.log(newPush);;
    });
  }
  // console.log("in loop", urls);

  // console.log('in next out of loop upon>>>>>>111111111111', urls);
  req.images = urls;
};

// const formValidation = multer.diskStorage({
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + file.fieldname + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype == 'image/png' ||
//       file.mimetype == 'image/jpg' ||
//       file.mimetype == 'image/jpeg'
//     ) {
//       cb(null, true);
//     } else {
//       res.json({
//         success: false,
//         message:
//           '!.......... wrong file upload....... only png , jpg , jpeg file is accepted',
//       });
//     }
//   },
//   limits: { fileSize: 1024 * 1024 },
// }).array('image', 9);
