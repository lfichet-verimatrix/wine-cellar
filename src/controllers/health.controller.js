const healthService = require("../services/health.service");

async function getStatus(req, res) {
  const data = healthService.getStatus();
  res.json({ success: true, data });
}

module.exports = { getStatus };
