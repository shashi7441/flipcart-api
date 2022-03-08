const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    password: {
      type: String,
      required: true,
    },
    isVarified: {
      type: Boolean,
      default: false,
    },

    idDeactivated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = new mongoose.model("User", userSchema);

module.exports = User;
