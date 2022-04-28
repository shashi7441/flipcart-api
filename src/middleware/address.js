const Joi = require('joi');

exports.adressValidation = (req, res, next) => {
  const addressValidate = (user) => {
    // console.log("addressValidate");
    const JoiSchema = Joi.object({
      userId: Joi.string()
        .hex()
        .length(24)
        .message('please fill id in proper format'),
      country: Joi.string().required().trim().min(3),
      state: Joi.string().required().trim().min(5),
      city: Joi.string().required().trim().min(3),
      streat: Joi.string().max(500).trim().min(3),
      pincode: Joi.number().min(6).required(),
      landMark: Joi.string().trim(),
      houseNo: Joi.string().trim().required(),
      addressType: Joi.string().trim().required(),
    });
    return JoiSchema.validate(user);
  };
  const response = addressValidate(req.body);
  if (response.error) {
    // console.log("err");
    const msg = response.error.details[0].message;
    return res
      .status(422)
      .json({ status: 422, message: msg.replace(/[^a-zA-Z ]/g, '') });
  } else {
    next();
  }
};
