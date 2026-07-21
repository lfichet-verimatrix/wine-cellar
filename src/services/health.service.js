const config = require("../config");

function getStatus() {
  return {
    status: "ok",
    environment: config.env,
    uptime: process.uptime(),
  };
}

module.exports = { getStatus };
