const winston = require("winston");

// Create a logger instance
exports.logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    ...(!process.env.NODE_ENV !== "prod"
      ? [
          new winston.transports.Console({
            format: winston.format.simple(),
          }),
        ]
      : []),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
