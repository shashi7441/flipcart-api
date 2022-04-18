const Sellerprofile = require('../models/sellerPrfile');
const User = require('../models/user');

exports.getProfile = async (req, res) => {
  try {
    const data = await Sellerprofile.findOne({ _id: _id });
    if (!data) {
      res.send({
        success: false,
        message: 'wrong data',
      });
    } else {
      res.send({
        success: true,
        data: data,
      });
    }
  } catch (e) {
    res.json({
      success: false,
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

    console.log('sellerData', sellerData);
    console.log('find', data);

    if (!data) {
      if (sellerData) {
        if (sellerData.role === 'seller') {
          req.body.isKyc = true;
          const create = await Sellerprofile(req.body);
          const result = await create.save();
          res.json({
            success: true,
            message: 'profile created successfuly',
            data: result,
          });
        } else {
          res.json({
            success: false,
            message: 'you are not seller',
          });
        }
      } else {
        res.json({
          success: false,
          message: 'user not found',
        });
      }
    } else {
      res.json({
        success: false,
        message: 'profile already created',
      });
    }
  } catch (e) {
    res.json({
      success: false,
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
      res.json({
        success: false,
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

      res.json({
        success: true,
        message: 'update successfully',
        data: data,
      });
    } else {
      res.json({
        success: false,
        message: 'not found',
      });
    }
  } catch (e) {
    res.json({
      success: false,
      data: e.message,
    });
  }
};
