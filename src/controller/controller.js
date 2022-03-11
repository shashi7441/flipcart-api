const { Seller } = require("../models/index");
const Otpvalid = require("../models/otpModel");

const { Crypto_token } = require("../middleware/index");
module.exports = {
  getApi: async (req, res) => {
    res.send("hello from the other side ");
  },

  signup: async (req, res, next) => {
    const sellerFind = await Seller.findOne({
      email: req.body.email,
      phone: req.body.phone,
    });
    console.log(("sellerfind", sellerFind));
    if (!sellerFind) {
      const createUser = Seller(req.body);
      const token = Crypto_token();
      createUser.refreshToken = token;
      const result = await createUser.save();
      console.log(result);
      res.send(result);
      req.result = result;
      next();
    } else {
      res.json({
        message: "selller already exist",
      });
    }
  },

  verifiedToken: async (req, res) => {
    const verifyToken = req.params.token;
    const user = await Seller.findOne({ refreshToken: verifyToken });
    if (user) {
      const update = await Seller.updateOne(
        { refreshToken: verifyToken },
        { isVarified: true }
      );
      console.log("44746><><<?>", update);
      res.send("verified");
    } else {
      res.send("unverified token");
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const contact = req.body.phone;
      const otp = req.body.otp;
      const otpUser = await Otpvalid.findOne({ phone: contact });
      const user = await Seller.findOne({ phone: contact });
      if (user) {
        if (user.isVarified === false) {
          if (otpUser.otp === otp) {
            await Seller.updateOne({ phone: contact, isVarified: true });
            res.status(200).json({
              message:
                "seller verfified successfull !! wait for admins approval",
              status: 200,
              success: true,
            });
          } else {
            res.status(401).json({
              message: "invalid otp",
              status: 401,
              success: false,
            });
          }
        } else {
          res.json({
            message: "already verified",
            success: false,
          });
        }
      } else {
        res.status(404).json({
          message: "user not found ; check input -'+91 before contact'",
          status: 404,
          success: false,
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
  adminAprovel: async (req, res) => {
    const id = req.body._id;
    console.log(id);
    const user = await Seller.findOne({ _id: id });
    console.log(user);
    if (!user) {
      res.send("invald user");
    }
    else if(user.isAprroved == true){
       res.send('seller already verified')
    } 
    else {
      const result = await Seller.updateOne({isAprroved:true });
      console.log(result);
      res.send(result)
    }
  },
};
