const app = require("./app");
const { logger } = require("./src/utils/logger/loggerUtils");

const port = process.env.PORT || 4000;

app.listen(port, (err) => {
  if (err) {
    logger.error(`Error starting server: ${err}`);
    process.exit(1);
  }

  logger.info(`Server is running on port ${port}`);
});
