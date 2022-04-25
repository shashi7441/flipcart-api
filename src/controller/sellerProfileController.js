const Sellerprofile = require('../models/sellerPrfile');
const User = require('../models/user');

exports.getProfile = async (req, res) => {
  try {
    const data = await Sellerprofile.findOne({ _id: _id });
    if (!data) {
      return res.send({
        statusCode:400,
        message: 'data not found',
      });
    } else {
    return  res.send({
      statusCode:200,
        data: data,
      });
    }
  } catch (e) {
   return res.json({
    statusCode:400,
      message: e.message,
    });
  }
};
exports.sellerProfileCreate = async (req, res) => {
  try {
    const data = await Sellerprofile.findOne({
      sellerId: req.body.sellerId,
    });

    const sellerData = await User.findOne({ _id: req.body.sellerId }).populate(
      'sellerId',
      'fullName'
    );
    if (!data) {
      if (sellerData) {
        if (sellerData.role === 'seller') {
          req.body.isKyc = true;
          const create = await Sellerprofile(req.body);
          const result = await create.save();
          return res.json({
            statusCode:200,
            message: 'profile created successfuly',
            data: result,
          });
        } else {
          return res.json({
            statusCode:400,
            message: 'you are not seller',
          });
        }
      } else {
      return  res.json({
        statusCode:400,
          message: 'seller not found',
        });
      }
    } else {
    return  res.json({
      statusCode:400,
        message: 'profile already created',
      });
    }
  } catch (e) {
     return    res.json({
      statusCode:400,
      message: e.message,
    });
  }
};

exports.sellerProfileUpdate = async (req, res) => {
  try {
    const _id = req.params.id;
    const data = await Sellerprofile.findOne({ _id: _id });
    const seller = await User.findOne({ _id: req.body.sellerId });
    console.log('seller', seller);
    if (Object.entries(req.body).length == 0) {
     return  res.json({
      statusCode:400,
        message: ' please fill the field',
      });
    }
    if (req.body.fullName) {
      console.log('fulllnamerdsg', req.body.fullName);
      const userUpdate = await User.updateOne(
        { _id: req.body.sellerId },
        req.body
      );
    }
    if (data) {
      const updateDocument = await Sellerprofile.updateOne({ _id }, req.body, {
        new: true,
      });
      const data = await Sellerprofile.findOne({ _id: _id });

     return res.json({
      statusCode:200,
        message: 'profile update successfully',
        data: data,
      });
    } else {
     return res.json({
      statusCode:400,
        message: 'data not found',
      });
    }
  } catch (e) {
   return res.json({
    statusCode:400,
      data: e.message,
    });
  }
};
