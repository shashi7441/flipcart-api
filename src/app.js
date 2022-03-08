const express = require("express");
const app = express();
require("../src/config/index");
require("dotenv").config();
const port = process.env.PORT;

const Routes = require("./routes/index");

app.use(express.json());

app.use("/", Routes);

app.listen(port, () => {
  console.log(`server is live at ${port}`);
});
