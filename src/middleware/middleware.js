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
      fullName: Joi.string().max(30).required().trim(),
      aboutUs: Joi.string().max(500).trim(),
      role: Joi.string(),
    });
    return JoiSchema.validate(user);
  };
  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
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
        .regex(/^(\+91)[789]\d{9}$/),
      fullName: Joi.string().max(30).required().trim(),
      aboutUs: Joi.string().max(500).trim(),
      role: Joi.string(),
    });
    return JoiSchema.validate(user);
  };
  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
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
        .regex(/^(\+91)[789]\d{9}$/),
      fullName: Joi.string().max(30).required().trim(),
      aboutUs: Joi.string().max(500).trim(),
      role: Joi.string(),
    });
    return JoiSchema.validate(user);
  };
  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
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
        .regex(/^(\+91)[789]\d{9}$/),
      fullName: Joi.string().max(30).trim(),
      aboutUs: Joi.string().max(500).trim(),
      role: Joi.string(),
    }).xor('email', 'phone');
    return JoiSchema.validate(user);
  };
  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
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
        .regex(/^(\+91)[789]\d{9}$/),
      fullName: Joi.string().max(30).trim(),
      aboutUs: Joi.string().max(500).trim(),
      role: Joi.string(),
    }).xor('email', 'phone');
    return JoiSchema.validate(user);
  };
  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
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
        .regex(/^(\+91)[789]\d{9}$/),
      otp: Joi.string().required(),
    });
    return JoiSchema.validate(user);
  };
  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
  } else {
    next();
  }
};
exports.adressValidation = (req, res, next) => {
  const validateUser = (user) => {
    const JoiSchema = Joi.object({
      userId: Joi.string().trim(),
      country: Joi.string().required().trim(),
      state: Joi.string().required().trim(),
      city: Joi.string().required().trim(),
      streat: Joi.string().max(500).trim(),
      pincode: Joi.number().min(6).required(),
      phone: Joi.string().min(13).required(),
      fullName: Joi.string().required().trim(),
      landMark: Joi.string().trim(),
      houseNo: Joi.string().trim().required(),
      addressType: Joi.string().trim().required(),
    });
    return JoiSchema.validate(user);
  };
  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
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
        .pattern(
          new RegExp(' ^[2-9]{1}[0-9]{3}[s-]\\s[0-9]{4}[s-]\\s[0-9]{4}$')
        )
        .length(14),
      panCardNumber: Joi.string()
        .required()
        .trim()
        .pattern(new RegExp('[A-Z]{5}[0-9]{4}[A-Z]{1}')),
      gstNumber: Joi.string()
        .pattern(
          new RegExp(
            '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
          )
        )
        .length(15)
        .required(),
    });
    return JoiSchema.validate(user);
  };
  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
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
      title: Joi.string().required().min(5),
      rating: Joi.number(),
      isAvailable: Joi.boolean(),
      quantity: Joi.number(),
      isApproved: Joi.boolean(),
    });
    return JoiSchema.validate(user);
  };

  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
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
    return res.status(422).json({ status: 422, message: msg });
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
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
  } else {
    next();
  }
};

exports.photoValidation = (req, res, next) => {
  const validateUser = (user) => {
    const JoiSchema = Joi.object({
      image: Joi.string().trim(),
      text: Joi.string().required(),
    });

    console.log('<><><>,</></></> in  validation', req);
    return JoiSchema.validate(user);
  };

  const response = validateUser(req.body);
  if (response.error) {
    const msg = response.error.details[0].message;
    return res.status(422).json({ status: 422, message: msg });
  } else {
    next();
  }
};

exports.productUpdateValidation = (req, res, next) => {
  try {
    const validateUser = (user) => {
      const JoiSchema = Joi.object({
        createdBy: Joi.string().trim(),
        price: Joi.number(),
        highlight: Joi.string().trim(),
        services: Joi.string().trim(),
        availableOffer: Joi.string().trim(),
        color: Joi.string().trim(),
        categoryId: Joi.string().trim(),
        brandId: Joi.string().trim(),
        size: Joi.number(),
        title: Joi.string().min(5),
        rating: Joi.number(),
        isAvailable: Joi.boolean(),
        isApproved: Joi.boolean(),
        quantity: Joi.number(),
      });
      JoiSchema.validate(user);
      next();
    };
  } catch (e) {
    console.log(e);
  }
};

exports.addToCartValidation = () => {
  try {
    const validateUser = (user) => {
      const JoiSchema = Joi.object({
        quantity: Joi.number().message('quantity should be a  number'),
        createdBy: Joi.string(),
        productId: Joi.string(),
      });
      JoiSchema.validate(user);
      next();
    };
  } catch (e) {
    console.log(e);
  }
};
