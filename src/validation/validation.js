const joi = require("joi");

module.exports = {
  sellerValid: async (req, res, next) => {
    const data = await joi.object({
      role: joi.string().min(2).max(20).trim(),
      firstName: joi.string().min(2).max(20).trim(),
      lastName: joi.string().min(2).max(20).trim(),
      phone: joi.string(),
      email: joi.string().email().min(2).trim(),
      password: joi.string().required().trim().max(6),
      isVerified: joi.boolean(),
      idDeactivated: joi.boolean(),
    });
    const valid = await data.validate(req.body);
    if (valid.error) {
      res.status(422).json({
        message: valid.error.details[0].message,
        status: 422,
        success: false,
      });
    } else {
      next();
    }
  },
};
