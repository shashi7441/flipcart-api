const express = require("express");
const routes = express.Router();
const {
  getApi,
  signup,
  verifiedToken,
  verifyOtp,
} = require("../controller/controller");
const { sellerValid } = require("../validation");
const { checkEmail,otp } = require("../services/service");
routes.get("/", getApi);
routes.post("/login", sellerValid, checkEmail, signup, otp);
routes.post("/login/verifyotp", verifyOtp);
routes.get("/verifytoken/:token", verifiedToken);

module.exports = routes;
