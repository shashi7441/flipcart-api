const error = (error, req, res, next) => {
  console.log(error);
  return res.status(error.statusCode).json({
    statusCode: error.statusCode,
    message: error.message,
  });
};

class Apierror {
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = {
  Apierror,
  error,
};
