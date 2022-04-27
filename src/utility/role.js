const User = require('../models/user');

exports.roleCheack = (roles) => {
  return async (req, res, next) => {
    // console.log('in varify', roles.includes());
    const data = await User.findOne({ _id: req._id });
    if (data) {
      if (roles == data.role) {
        return next();
      } else {
        res.json({
          success: false,
          message: `${data.role} ${data.fullName} you are not allowed to access this api `,
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

exports.multiRoleCheack = (...role) => {
  return async (req, res, next) => {
    const roleData = role.includes(req.userData.role);
    if (req.userData) {
      if (roleData) {
        return next();
      } else {
        return res.json({
          statusCode: 401,
          message: ` ${req.userData.role} ${req.userData.fullName} you are not allowed to access this api `,
        });
      }
    } else {
      return res.json({
        statusCode: 400,
        message: 'data not available',
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
