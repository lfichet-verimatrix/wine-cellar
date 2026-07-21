const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

/**
 * Connect to an in-memory MongoDB instance before all tests in this file.
 */
async function setup() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
}

/**
 * Clear all collections between tests.
 */
async function clearDatabase() {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
}

/**
 * Disconnect and stop the in-memory MongoDB after all tests.
 */
async function teardown() {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
}

module.exports = { setup, clearDatabase, teardown };
