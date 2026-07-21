const dotenv = require("dotenv");

dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3000,
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
  logLevel: process.env.LOG_LEVEL || "info",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/wine-cellar",
};

module.exports = config;
