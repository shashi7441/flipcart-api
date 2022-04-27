const Joi = require('joi');

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
