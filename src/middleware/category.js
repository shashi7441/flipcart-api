const Joi = require('joi');

exports.categoryValidation = (req, res, next) => {
  const validateUser = (user) => {
    const JoiSchema = Joi.object({
      category: Joi.string().trim().required(),
    });
    return JoiSchema.validate(user);
  };

  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res
      .status(422)
      .json({ status: 422, message: msg.replace(/[^a-zA-Z ]/g, '') });
  } else {
    next();
  }
};
