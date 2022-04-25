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
        .length(6)
        .required()
        .trim(),
      fullName: Joi.string().min(3).max(30).trim(),
    });
    return JoiSchema.validate(user);
  };
  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg.replace(/[^a-zA-Z ]/g, "") });
  } else {
    next();
  }
};

exports.sellerSignupValidation = (req, res, next) => {
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
        .length(6)
        .required()
        .trim(),
      phone: Joi.string()
        .required()
        .trim()
        .regex(/^(\+91)[789]\d{9}$/)
        .message(' please input in this format +919856521463'),
      fullName: Joi.string().min(3).required().trim().max(25),
    });
    return JoiSchema.validate(user);
  };
  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg.replace(/[^a-zA-Z ]/g, "") });
  } else {
    next();
  }
};

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
    return res.status(422).json({ status: 422, message: msg.replace(/[^a-zA-Z ]/g, "") });
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
    return res.status(422).json({ status: 422, message: msg.replace(/[^a-zA-Z ]/g, "") });
  } else {
    next();
  }
};

exports.sellerLoginValidation = (req, res, next) => {
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
    return res.status(422).json({ status: 422, message: msg.replace(/[^a-zA-Z ]/g, "") });
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
    return res.status(422).json({ status: 422, message: msg.replace(/[^a-zA-Z ]/g, "") });
  } else {
    next();
  }
};
exports.adressValidation = (req, res, next) => {
  const addressValidate = (user) => {
    // console.log("addressValidate");
    const JoiSchema = Joi.object({
      userId: Joi.string().trim(),
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
    return res.status(422).json({ status: 422, message: msg.replace(/[^a-zA-Z ]/g, "") });
  } else {
    next();
  }
};

exports.sellerProfileValidation = (req, res, next) => {
  const validateUser = (user) => {
    const JoiSchema = Joi.object({
      sellerId: Joi.string().trim(),
      adharCardNumber: Joi.string()
        .required()
        .trim()
        .pattern(new RegExp('^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$'))
        .length(14)
        .message('please input in this format 3675 9834 6012'),
      panCardNumber: Joi.string()
        .required()
        .trim()
        .pattern(new RegExp('[A-Z]{5}[0-9]{4}[A-Z]{1}'))
        .message('please input in this format KFOEG6258A'),
      gstNumber: Joi.string()
        .pattern(
          new RegExp(
            '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
          )
        )
        .message('please input in this format 06BZAHM6385P6Z2')
        .length(15)
        .required(),
    });
    return JoiSchema.validate(user);
  };
  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg.replace(/[^a-zA-Z ]/g, "") });
  } else {
    next();
  }
};

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
    return res.status(422).json({ status: 422, message: msg.replace(/[^a-zA-Z ]/g, "") });
  } else {
    next();
  }
};

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
    return res.status(422).json({ status: 422, message: msg.replace(/[^a-zA-Z ]/g, "") });
  } else {
    next();
  }
};

exports.brandValidation = (req, res, next) => {
  const validateUser = (user) => {
    const JoiSchema = Joi.object({
      brand: Joi.string().trim().required(),
    });
    return JoiSchema.validate(user);
  };

  const response = validateUser(req.body);
  if (response.error) {
    let error = response.error.details[0].message;
    let msg = error.replace(/[^a-zA-Z ]/g, '');
    return res.status(422).json({ statusCode: 422, message: msg });
  } else {
    next();
  }
};

exports.addToCartValidation = (req, res, next) => {
  const validateUser = (user) => {
    const JoiSchema = Joi.object({
      ProductId: Joi.string().required(),
      quantity: Joi.number().required(),
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
