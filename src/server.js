const app = require("./app");
const config = require("./config");
const logger = require("./utils/logger");
const connectDB = require("./config/db");

async function start() {
  await connectDB(config.mongoUri);
  app.listen(config.port, () => {
    logger.info(`Server running on http://localhost:${config.port} [${config.env}]`);
  });
}

start();

