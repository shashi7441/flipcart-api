const User = require('../models/user');

exports.roleCheack = (roles) => {
  return async (req, res, next) => {
    // console.log('in roleCheack', req.id);
    // console.log('in varify', roles.includes());
    const data = await User.findOne({ _id: req.id });
    // console.log('data', data);
    if (data) {
      if (roles == data.role) {
        return next();
      } else {
        res.json({
          success: false,
          message: `${roles} you are not allowed to access this api `,
        });
      }
    } else {
      res.json({
        success: false,
        message: 'User is not available',
      });
    }
  };
};

exports.AdminRoleCheack = (a1) => {
  return async (req, res, next) => {
    const data = await User.findOne({ _id: req.id });
    if (data) {
      if (a1 == data.role) {
        return next();
      } else {
        res.json({
          success: false,
          message: `${a1} you are not allowed to access this api `,
        });
      }
    } else {
      res.json({
        success: false,
        message: 'User is not available',
      });
    }
  };
};
