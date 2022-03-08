const mongoose = require("mongoose");
require("dotenv").config();
module.exports = {
  db1: mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("database connected successfully");
    })
    .catch((e) => {
      console.log(e);
    }),
};
