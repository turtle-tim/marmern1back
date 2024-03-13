const mongoose = require("mongoose");

const { logger } = require("../utils/logger/loggerUtils");

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to database");
  })
  .catch((error) => {
    logger.error("Failed to connect to database!!!", error);
  });
