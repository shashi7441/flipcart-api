const Joi = require('joi');

exports.adminSignupValidation = (req, res, next) => {
  const validateUser = (user) => {
    const JoiSchema = Joi.object({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'net'] },
        })
        .trim()
        .required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .min(6)
        .max(20)
        .required()
        .trim()
        .message('please fill password will bi proper format'),
      fullName: Joi.string().min(3).max(30).trim(),
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
