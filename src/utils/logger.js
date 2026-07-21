const pino = require("pino");
const config = require("../config");

const logger = pino({
  level: config.logLevel,
  ...(config.env === "development" && {
    transport: {
      target: "pino-pretty",
      options: { colorize: true },
    },
  }),
});

module.exports = logger;
