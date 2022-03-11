const express = require("express");
const app = express()
const   logger  = require("./logger/logger");
require("../src/config/index");
require("dotenv").config();

const port = process.env.PORT;
const Routes = require("./routes/sellerRoute");
const  adminRoutes = require('./routes/adminRoute')
app.use(express.json());
app.use("/seller", Routes);
app.use('/admin',adminRoutes )


app.listen(port, () => {
  logger.info(`server is live at ${port}`);
});
