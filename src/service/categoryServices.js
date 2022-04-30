const Photo = require('../models/image');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.createCategoryPhoto = async (req, res) => {
  try {
 
    const create = await Photo({
      image: req.images,
      categoryId: req.categoryId,
    });

    const result = await create.save();
    req.results = result;
  } catch (e) {
    res.json({
      statusCode:400,
      data: e.message,
    });
  }
};

exports.deleteCategoryPhoto = async (req, res) => {
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
      message:e.message
    })


  }
};

exports.createAndUpdateCategoryPhoto = async (req, res) => {
try{
  const create = await Photo({
    image: req.images,
    categoryId: req.category_Id
  })
  const result = await create.save();
 
  req.photo_id = result._id;
}
catch(e){

return res.json({
  statusCode:400,
  data:e.message
})

}
};


exports.updateCategoryPhoto = async (req, res) => {
 

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
      }
    );
  }
};
