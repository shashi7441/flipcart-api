const Joi = require('joi');

exports.productValidation = (req, res, next) => {
  const validateUser = (user) => {
    const JoiSchema = Joi.object({
      createdBy: Joi.string()
        .hex()
        .length(24)
        .message('please fill id in proper format'),
      price: Joi.number().required(),
      highlight: Joi.string().trim().min(4).max(50),
      services: Joi.string().required().trim().min(5).max(50),
      availableOffer: Joi.string().trim().min(5).max(30),
      color: Joi.string().trim().min(3).max(15),
      image: Joi.string().trim(),
      categoryId: Joi.string()
      .hex()
      .length(24)
      .message('please fill id in proper format'),
      brandId: Joi.string()
      .hex()
      .length(24)
      .message('please fill id in proper format'),
      size: Joi.number(),
      title: Joi.string().required().min(5).trim().max(50),
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
