const addressRoutes = require('../routes/addressRoutes');
const cartRoutes = require('../routes/addToCart');
const adminRoutes = require('../routes/adminRoutes');

const brandRoutes = require('../routes/brand');

const categoryRoutes = require('../routes/category');

const orderRoutes = require('../routes/orderRoutes');
const productRoutes = require('../routes/productRoutes');

const reviewRoutes = require('../routes/reviewRoutes');

const sellerProfileRoutes = require('../routes/sellerProfileRoute');

const sellerRoutes = require('../routes/sellerRoutes');

const userRoutes = require('../routes/userRoutes');

module.exports = {
  addressRoutes,
  brandRoutes,
  cartRoutes,
  categoryRoutes,
  reviewRoutes,
  userRoutes,
  orderRoutes,
  productRoutes,
  sellerProfileRoutes,
  sellerRoutes,
  adminRoutes,
};
