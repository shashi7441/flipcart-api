const Joi = require('joi');

exports.orderValidation = (req, res, next) => {
  const validateOrder = (user) => {
    const JoiSchema = Joi.object({
      deliverTime: Joi.date(),
      productId: Joi.string().required().trim(),
      quantity: Joi.number().required(),
      addressId: Joi.string().trim()
    });
    return JoiSchema.validate(user);
  };
  const response = validateOrder(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
  } else {
    next();
  }
};
