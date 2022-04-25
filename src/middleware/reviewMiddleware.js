const Joi = require('joi');

exports.reviewValidation = (req, res, next) => {
  const validateReview = (user) => {
    const JoiSchema = Joi.object({
      title: Joi.string().trim().min(4).max(30).required(),
      comment: Joi.string().trim().min(4).max(100).required(),
      productId: Joi.string().required().trim(),
      rating: Joi.number().max(5).required(),
    });
    return JoiSchema.validate(user);
  };
  const response = validateReview(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res
      .status(422)
      .json({ status: 422, message: msg.replace(/[^a-zA-Z ]/g, '') });
  } else {
    next();
  }
};
