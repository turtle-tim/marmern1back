const mongoose = require("mongoose");

const { logger } = require("../utils/logger/loggerUtils");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info("Connected to database");
  })
  .catch((error) => {
    logger.error("Failed to connect to database!!!", error);
  });
