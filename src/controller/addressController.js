const Address = require('../models/address');
const User = require('../models/user');
const axios = require('axios');

exports.createAddress = async (req, res) => {
  try {
    const users = await User.findOne({ phone: req.body.phone });
    if (!users) {
      res.send('enter register number');
    }
    // console.log("in", users);
    const address = await Address.findOne({ phone: req.body.phone });
    if (!address) {
      req.body.userId
      req.body.isDefault = true;
      const createUser = await Address(req.body);
      const result = await createUser.save();
      res.json({
        success: true,
        message: 'Address register successfully',
      });
    } else {
      req.body.userId = users._id;
      const createUser = await Address(req.body);
      const result = await createUser.save();
      //   console.log("in addressController", result);
      res.json({
        success: true,
        message: 'Address register successfully',
      });
    }
  } catch (e) {
    res.json({
      success: false,
      data: e,
    });
  }
};

exports.getAddress = async (req, res) => {
  try {
    const find = await Address.find({ phone: req.body.phone });
    console.log(find);
    if (find) {
      res.json({
        success: true,
        data: find,
      });
    } else {
      res.json({
        success: false,
        message: 'address not found',
      });
    }
  } catch (e) {
    res.json({
      success: false,
      data: e,
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const _id = req.params._id;
    console.log(_id);
    const updateData = await Address.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    console.log(updateData);
    res.send('updated');
  } catch (e) {
    res.json({
      success: false,
      data: e,
    });
  }
};

exports.deleteData = async (req, res) => {
  const _id = req.params._id;
  console.log(_id);
  const deleteData = await Address.findByIdAndDelete(_id);
  console.log(deleteData);
  const results = await Address.find().sort({ createdAt: -1 });
  const updateData = await Address.updateOne(results[0], { isDefault: true });
  res.send('deleted');
};

exports.showAllState = async (req, res) => {
  try {
    const result = await axios.get(
      'https://countriesnow.space/api/v0.1/countries/states'
    );
    const hii = result.data.data;
    console.log(
      hii.map((i) => {
        return i.states;
      })
    );
  } catch (e) {
    res.json({
      success: false,
      data: e,
    });
  }
};

// await axios.get("https://countriesnow.space/api/v0.1/countries/states")
// .then(function (response) {
//     if(!req.query.country && !req.query.state ){
//     // res.send(response.data)}
//     const conuntryName = req.query.country
//     if(conuntryName){
//         const obj =response.data
//         var result = Object.entries(obj);
//         var result1 = Object.keys(result).map((key) => [ result[key]]);
//         const arr =  result1[2][0][1]
//         const states = []
//         for(var i = 0; i < arr.length; i++) {
//             if (arr[i].name == req.query.country) {
//                 states.push(arr[i].states)
//             }
//         }}
//         if(!conuntryName){
//         return res.send("wrong entry")
//       }
//         return res.send(response.data)
//     }catch(err){
//     console.log(err)
//     res.send(err)
//   