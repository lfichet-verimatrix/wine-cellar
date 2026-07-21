const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const pinoHttp = require("pino-http");
const config = require("./config");
const logger = require("./utils/logger");
const routes = require("./routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// --- Middleware stack (ordered per backend.md) ---
// 1. Security headers
app.use(helmet());

// 2. CORS
app.use(cors(config.cors));

// 3. Body parser
app.use(express.json());

// 4. Request logger (structured, pino-http)
app.use(pinoHttp({ logger }));

// --- Routes ---
app.use(routes);

// --- 404 handler ---
app.use(notFound);

// --- Centralized error handler (must be last, 4 args) ---
app.use(errorHandler);

module.exports = app;
