module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  // Increase timeout for in-memory MongoDB startup
  testTimeout: 30000,
};
