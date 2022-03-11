const mongoose = require("mongoose");
const otpModelSchema = mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Otpvalid = mongoose.model("Otpvalid", otpModelSchema);
module.exports = Otpvalid;
