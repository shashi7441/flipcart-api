const Category = require('../models/category');
const Brand = require('../models/brand');


exports.cheackBrandCategory = async (req, res , next) => {
  try {
    // console.log("branddddddddddddddd");
    const categoryData = await Category.findOne({ _id: req.body.categoryId });
    // console.log(categoryData);
    const brandData = await Brand.findOne({ _id: req.body.brandId });
    if (!brandData) {
      return res.json({
        statusCode:400,
        message: 'brand not found ',
      });
    } else if (brandData.isActive == false) {
      return res.json({
        statusCode:400,
        message: 'invalid credential',
      });
    }

    if (!categoryData) {
      return res.json({
        statusCode:400,
        message: 'category not found ',
      });
    } else if (categoryData.isActive == false) {
      return res.json({
        statusCode:400,
        message: 'invalid credential',
      });
    }
     next()

  } catch (e) {
    return res.json({
      statusCode:400,
      data: e.message,
    });
  }
};

exports.filterCheack = (req, res) => {
  const { filter } = req.query;
  const array = [
    'title',
    'categoryId',
    'brandId',
    'price',
    'image',
    'services',
  ];
  const newfilter = filterfunc(filter);
  if (!newfilter) {
    return { createdBy: req.id };
  } else {
    const arr2 = Object.keys(JSON.parse(filter));
    const newFilter = Object.assign({ createdBy: req.id }, JSON.parse(filter));
    const found = array.some((r) => arr2.includes(r));
    if (!found) {
      return
    } else {
      return newFilter;
    }
  }
};

function filterfunc(temp) {
  try {
    JSON.parse(temp);
  } catch (error) {
    return false;
  }
  return true;
}



exports.productFields = (req) => {
  try {
    if (req.query.fields) {
      const fields = req.query.fields.split(',').filter((element) => element);
      const allfields = {};
      fields.map((i) => {
        allfields[i] = 1;
      });
      return allfields;
    } else {
      return (fields = {
        id: 1,
        categoryId: 1,
        brandId: 1,
        image: 1,
        price: 1,
      });
    }
  } catch (e) {
    return {
      statusCode:400,
      message: e.message,
    };
  }
};



