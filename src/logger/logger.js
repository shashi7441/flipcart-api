const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  transports: [
    new transports.Console({
      level: "info",
      level:"",
      filename: "combined.log",
      format: format.json(),
    }),
  ],
});

module.exports = logger;
