const logger = require("../utils/logger");
const { AppError, ValidationError } = require("../utils/errors");
const config = require("../config");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;

  logger.error({ err, reqId: req.id }, err.message);

  const response = {
    success: false,
    error: status < 500 ? err.message : "Something went wrong",
  };

  // Include validation details if present
  if (err instanceof ValidationError && err.details.length > 0) {
    response.details = err.details;
  }

  // Include stack trace only in development for non-operational errors
  if (config.env === "development" && !(err instanceof AppError)) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}

module.exports = errorHandler;
