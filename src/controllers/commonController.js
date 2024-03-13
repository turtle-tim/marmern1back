const { logger } = require("../utils/logger/loggerUtils");

exports.getVersionNumber = async (req, res) => {
  logger.info(`Fetching version #`);

  res.json({
    msg: "v2.0",
  });
};
