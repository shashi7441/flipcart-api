const Address = require('../models/address');
const User = require('../models/user');
const axios = require('axios');

exports.createAddress = async (req, res) => {
  try {
    const {
      userId,
      country,
      state,
      city,
      streat,
      pincode,
      landMark,
      houseNo,
      addressType,
      isDefault,
    } = req.body;
    const users = await User.findOne({ _id: req.id });
    if (!users) {
      return res.json({
        statusCode: 400,
        message: 'user not found',
      });
    }
    // console.log("in", users);
    const address = await Address.findOne({ userId: req.id });
    if (!address) {
      req.body.isDefault = true;
      const createUser = await Address({
        userId: req.id,
        country,
        state,
        city,
        pincode,
        landMark,
        addressType,
        isDefault: true,
        houseNo,
        streat,
      });
      const result = await createUser.save();
      // req.addressId = result._id;

      return res.json({
        statusCode: 200,
        message: 'Address register successfully',
      });
    } else {
      req.body.userId = users._id;
      const createUser = await Address(req.body);
      const result = await createUser.save();
      //   console.log("in addressController", result);
      return res.json({
        statusCode: 200,
        message: 'Address register successfully',
      });
    }
  } catch (e) {
    return res.json({
      statusCode: 400,
      data: e.message,
    });
  }
};

exports.getAddress = async (req, res) => {
  try {
    const addressFind = await Address.find({ userId: req.id }).populate(
      'userId',
      'phone fullName'
    );
    console.log(addressFind);
    if (addressFind) {
      return res.json({
        statusCode:200,
        data: addressFind,
      });
    } else {
      return res.json({
         statusCode:400,
        message: 'address not found',
      });
    }
  } catch (e) {
    return res.json({
      statusCode:400,
      data: e.message,
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const _id = req.params.id;
    console.log(_id);
    if (Object.entries(req.body).length == 0) {
      return res.json({
        statusCode:400,
        message: ' please fill the field',
      });
    }
    const updateData = await Address.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    console.log(updateData);
    return res.json({
      statusCode:200,
      message: 'address updated successfully',
    });
  } catch (e) {
    return res.json({
      statusCode:400,
      data: e.message,
    });
  }
};

exports.deleteData = async (req, res) => {
  try {
    const _id = req.params.id;
    // console.log(_id);
    const deleteData = await Address.findByIdAndDelete(_id);
    // console.log(deleteData);
    const results = await Address.find().sort({ createdAt: -1 });
    const updateData = await Address.updateOne(results[0], { isDefault: true });
    return res.json({
      statusCode:400,
      message: 'deleted successfully',
    });
  } catch (e) {
    return res.json({
      statusCode:400,
      message: e.message,
    });
  }
};

exports.showAllState = async (req, res) => {
  try {
    await axios
      .get('https://countriesnow.space/api/v0.1/countries/states')
      .then(function (response) {
        if (!req.query.country && !req.query.state) {
          return res.send(response.data);
        }
        const country = req.query.country;
        // console.log(country);
        if (country) {
          const obj = response.data;
          // console.log('>>>>>>>>>>>>>>>>>>', obj);
          var result = Object.entries(obj);
          var result1 = Object.keys(result).map((key) => [result[key]]);
          const arr = result1[2][0][1];
          const states = [];
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].name == req.query.country) {
              states.push(arr[i].states);
            }
          }
        }
        if (!country) {
          return res.json({
            statusCode:400,
            message: 'wrong data',
          });
        }
        return res.send(response.data);
      });
  } catch (e) {
    return res.json({
      statusCode:400,
      message: e.message,
    });
  }
};
