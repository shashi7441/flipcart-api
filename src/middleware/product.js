const Joi = require('joi');

exports.productValidation = (req, res, next) => {
  const validateUser = (user) => {
    const JoiSchema = Joi.object({
      createdBy: Joi.string().trim(),
      price: Joi.number().required(),
      highlight: Joi.string().trim(),
      services: Joi.string().required().trim(),
      availableOffer: Joi.string().trim(),
      color: Joi.string().trim(),
      image: Joi.string().trim(),
      categoryId: Joi.string().trim().required(),
      brandId: Joi.string().required().trim(),
      size: Joi.number(),
      title: Joi.string().required().min(5).trim(),
      rating: Joi.number(),
      isAvailable: Joi.boolean(),
      quantity: Joi.number().required(),
      isApproved: Joi.boolean(),
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
