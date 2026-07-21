const mongoose = require("mongoose");
const logger = require("../utils/logger");

async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error({ err: error }, "MongoDB connection failed");
    process.exit(1);
  }
}

module.exports = connectDB;
