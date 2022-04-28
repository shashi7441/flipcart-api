const {
  createAddress,
  deleteData,
  updateAddress,
  showAllState,
  getAddress,
} = require('../controller/addressController');

const {
  addToCart,
  incrementAndDecrement,
  deleteAllItemInCart,
  deleteOneItemInCart,
  allCart,
} = require('../controller/addTOCartController');

const {
  sellerReject,
  signupejs,
  adminSignup,
  getAllSeller,
  routeCheck,
  dashBoardejs,
} = require('../controller/adminController');

const {
  updateBrand,
  createBrand,
  showBrand,
  deleteBrand,
} = require('../controller/brandController');

const {
  updateCategory,
  createCategory,
  showCategory,
  deleteCategory,
} = require('../controller/categoryController');

const {
  order,
  cancelOrder,
  changeDate,
  showOneOrder,
  stateChange,
  deliverProduct,
} = require('../controller/orderController');

const {
  createAndUpdatePhoto,
  createPhoto,
  showImage,
  deletePhoto,
  updatePhoto,
  updatePhotoAndBody,
} = require('../controller/photoController');

const {
  createProduct,
  updateProducts,
  showOneProduct,
  showOneProductForPublic,
  getAllProductsForPublic,
  getAllProduct,
  deleteProducts,
  isApproved,
} = require('../controller/productController');

const {
  addReview,
  updateReview,
  deleteReview,
  getAllReview,
  getReviewForUser,
} = require('../controller/reviewController');

const { signup, login } = require('../controller/sellerController');

const {
  getProfile,
  sellerProfileCreate,
  sellerProfileUpdate,
} = require('../controller/sellerProfileController');

const { userLogin, userSignup } = require('../controller/userController');

module.exports = {
  order,
  getAddress,
  getAllProduct,
  getAllProductsForPublic,
  getAllReview,
  getAllSeller,
  getProfile,
  getReviewForUser,
  cancelOrder,
  changeDate,
  createAddress,
  createAndUpdatePhoto,
  createBrand,
  createCategory,
  createPhoto,
  createProduct,
  updateAddress,
  updateBrand,
  updateCategory,
  updatePhoto,
  updatePhotoAndBody,
  updateProducts,
  updateReview,
  userLogin,
  userSignup,
  dashBoardejs,
  deleteAllItemInCart,
  deleteBrand,
  deleteCategory,
  deleteData,
  deleteOneItemInCart,
  deletePhoto,
  deletePhoto,
  deleteProducts,
  deleteReview,
  deliverProduct,
  sellerProfileCreate,
  sellerProfileUpdate,
  sellerReject,
  showAllState,
  showBrand,
  showCategory,
  showImage,
  showOneOrder,
  showOneProduct,
  showOneProductForPublic,
  signup,
  signupejs,
  stateChange,
  isApproved,
  incrementAndDecrement,
  addReview,
  addToCart,
  adminSignup,
  allCart,
  routeCheck,
  login,
};
