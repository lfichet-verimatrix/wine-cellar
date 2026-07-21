const { Router } = require("express");
const healthRoutes = require("./health.routes");
const winesRoutes = require("./wines.routes");

const router = Router();

// Root route
router.get("/", (req, res) => {
  res.json({ success: true, data: { message: "Wine Cellar API" } });
});

// Mount resource routers
router.use("/health", healthRoutes);
router.use("/wines", winesRoutes);

module.exports = router;
