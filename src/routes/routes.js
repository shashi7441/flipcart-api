const express = require("express");
const routes = express.Router();
const { getApi, signup } = require("../controller/controller");

routes.get("/get", getApi);

routes.post("/signup", signup);

module.exports = routes;
