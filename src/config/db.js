const mongoose = require('mongoose');
const logger = require('../logger/loggger');
require('dotenv').config();

exports.database = async (db) => {
  try {
    await mongoose
      .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((db) => {
        console.log('database connnected successfully');
      });
  } catch (e) {
    console.log(e);
  }
};
