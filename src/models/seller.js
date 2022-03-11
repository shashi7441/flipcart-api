const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const sellerSchema = mongoose.Schema(
  {
    phone: String,
    email: String,
    password: String,
    refreshToken: {
      type: String,
      expiresIn: "10m",
    },
    isVarified: {
      type: Boolean,
      default: false,
    },
    idDeactivated: {
      type: Boolean,
      default: false,
    },
    isAprroved:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

sellerSchema.pre("save", async function (req, res, next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;

