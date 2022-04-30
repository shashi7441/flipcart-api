const Sellerprofile = require('../models/sellerPrfile');
const User = require('../models/user');
const { Apierror } = require('../utility/error');
exports.getProfile = async (req, res, next) => {
  try {
    const data = await Sellerprofile.findOne({ _id: _id });
    if (!data) {
      return next(new Apierror('data not found', 400));
    } else {
      return res.send({
        statusCode: 200,
        data: data,
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};
exports.sellerProfileCreate = async (req, res, next) => {
  try {
    const { sellerId, adharCardNumber, panCardNumber, gstNumber } = req.body;

    const data = await Sellerprofile.findOne({
      sellerId: sellerId,
    });

    const sellerData = await User.findOne({ _id: sellerId }).populate(
      'sellerId',
      'fullName'
    );
    if (!sellerData) {
      return next(new Apierror('seller not found', 400));
    }
    if (!sellerData.role === 'seller') {
      return next(new Apierror('you are not seller', 400));
    }

    if (data) {
      return next(new Apierror('profile already created', 400));
    }

    if (!data) {
      const create = await Sellerprofile({
        sellerId: sellerId,
        adharCardNumber: adharCardNumber,
        panCardNumber: panCardNumber,
        gstNumber: gstNumber,
        isKyc: true,
      });
      const result = await create.save();
      return res.json({
        statusCode: 200,
        message: 'profile created successfuly',
        data: result,
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      message: e.message,
    });
  }
};

exports.sellerProfileUpdate = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const { sellerId, adharCardNumber, panCardNumber, gstNumber, fullName } =
      req.body;
    const data = await Sellerprofile.findOne({ _id: _id });
    const seller = await User.findOne({ _id: sellerId });

    if (Object.entries(req.body).length == 0) {
      return next(new Apierror(' please fill the field', 400));
    }
    if (!data) {
      return next(new Apierror('data not found', 400));
    }
    if (!seller) {
      return next(new Apierror('seller not found', 400));
    }
    if (fullName) {
      const userUpdate = await User.updateOne(
        { _id: req.body.sellerId },
        req.body
      );
    }
    if (data) {
      const updateDocument = await Sellerprofile.updateOne(
        { _id },
        {
          adharCardNumber: adharCardNumber,
          panCardNumber: panCardNumber,
          gstNumber: gstNumber,
        },
        { new: true }
      );
      const data = await Sellerprofile.findOne({ _id: _id });

      return res.json({
        statusCode: 200,
        message: 'profile update successfully',
        data: data,
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      data: e.message,
    });
  }
};
