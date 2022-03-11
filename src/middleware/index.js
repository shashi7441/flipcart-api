const crypto = require("crypto");

exports.Crypto_token = () => {
  return crypto
    .createHash("sha256")
    .update("Man oh man do I love node!")
    .digest("hex");
};

