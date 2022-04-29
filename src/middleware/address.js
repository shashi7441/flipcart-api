const Joi = require('joi');

exports.adressValidation = (req, res, next) => {
  const addressValidate = (user) => {
    const JoiSchema = Joi.object({
      userId: Joi.string()
        .hex()
        .length(24)
        .message('please fill id in proper format'),
      country: Joi.string().required().trim().min(3).max(30),
      state: Joi.string().required().trim().min(5).max(30),
      city: Joi.string().required().trim().min(3).max(30),
      streat: Joi.string().trim().min(3).max(30),
      pincode: Joi.number().min(6).required().max(30),
      landMark: Joi.string().trim().max(50).min(3),
      houseNo: Joi.string().trim().required().min(3).max(20),
      addressType: Joi.string().trim().required().min(3).max(30),
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
