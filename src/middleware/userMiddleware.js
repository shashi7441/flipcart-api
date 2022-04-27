const Joi = require('joi');

exports.userSignupValidation = (req, res, next) => {
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
        .required()
        .trim(),
      phone: Joi.string()
        .required()
        .trim()
        .regex(/^(\+91)[789]\d{9}$/)
        .message(' please input in this format +919874562358'),
      fullName: Joi.string().min(3).required().trim().max(30),
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

exports.userLoginValidation = (req, res, next) => {
  const validateUser = (user) => {
    const JoiSchema = Joi.object({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'net'] },
        })
        .trim(),
      password: Joi.string()
        .min(6)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
        .trim(),
      phone: Joi.string()
        .trim()
        .regex(/^(\+91)[789]\d{9}$/)
        .message(' please input in this format +917441177893'),
    }).xor('email', 'phone');
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

exports.otpVerifyValidation = (req, res, next) => {
  const validateUser = (user) => {
    const JoiSchema = Joi.object({
      phone: Joi.string()
        .trim()
        .required()
        .message(' please input in this format +917441177893')
        .regex(/^(\+91)[789]\d{9}$/),
      otp: Joi.string().required(),
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
