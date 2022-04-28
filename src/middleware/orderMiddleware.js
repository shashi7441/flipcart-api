const Joi = require('joi');

exports.orderValidation = (req, res, next) => {
  const validateOrder = (user) => {
    const JoiSchema = Joi.object({
      orders: Joi.array().required(),
      addressId: Joi.string()
        .hex()
        .length(24)
        .message('please fill id in proper format'),
      paymentMode: Joi.string().trim().min(3),
      productId: Joi.string()
        .hex()
        .length(24)
        .trim()
        .message('please fill id in proper format'),
      quantity: Joi.number(),
    });
    return JoiSchema.validate(user);
  };
  const response = validateOrder(req.body);
  if (response.error) {
    const message = response.error.details[0].message;
    return res
      .status(422)
      .json({ status: 422, message: message.replace(/[^a-zA-Z ]/g, '') });
  } else {
    next();
  }
};
