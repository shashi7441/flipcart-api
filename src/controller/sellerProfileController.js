const Sellerprofile = require('../models/sellerPrfile');
// const{checkSeller} = require('../service/sellerProfileService')
const User = require('../models/user');
exports.sellerProfileCreate = async (req, res) => {
  try {
    console.log('hiiiiiiiiiii', req.body.sellerId);
    const data = await Sellerprofile.findOne({
      sellerId: req.body.sellerId,
    });

    const sellerData = await User.findOne({ _id: req.body.sellerId });
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
    if (e.name === 'CastError') {
      res.json({
        success: false,
        message:
          'wrong objeact id plese write in this format(6244027080e1350cc114528b)',
      });
    }
  }
};

exports.sellerProfileUpdate = async (req, res) => {
  try {
    const _id = req.params._id;
    const data = await Sellerprofile.findOne({ _id: _id });
    console.log('data', data);
    console.log('thorufh postman', req.body);
    console.log('in profileUpdate', req.body.sellerId);

    const seller = await User.findOne({ _id: req.body.sellerId });
    console.log('seller', seller);
    if (req.body.fullName) {
      console.log('fulllnamerdsg', req.body.fullName);
      const userUpdate = await User.updateOne(
        { _id: req.body.sellerId },
        req.body
      );
    }
    if (data) {
      const updateDocument = await Sellerprofile.updateOne({ _id }, req.body);
      res.json({
        success: true,
        message: 'update successfully',
      });
      console.log(updateDocument);
    } else {
      res.json({
        success: false,
        message: 'not found',
      });
    }
  } catch (e) {
    res.json({
      success: false,
      data: e,
    });
  }
};
