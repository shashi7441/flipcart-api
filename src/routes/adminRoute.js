const express = require("express");
const adminRoutes = express.Router();
const { adminAprovel } = require("../controller/controller");

adminRoutes.post("/shashi", adminAprovel);

module.exports = adminRoutes;
