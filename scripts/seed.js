const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const config = require("../src/config");
const Wine = require("../src/models/Wine");

async function seed() {
  console.log(`Connecting to MongoDB: ${config.mongoUri}`);
  await mongoose.connect(config.mongoUri);
  console.log("Connected.");

  // Read wines from the seed file
  const filePath = path.resolve(__dirname, "../wines.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const wines = JSON.parse(raw);

  console.log(`Found ${wines.length} wines to seed.`);

  // Clear existing wines
  await Wine.deleteMany({});
  console.log("Cleared existing wines.");

  // Insert seed data
  const inserted = await Wine.insertMany(wines);
  console.log(`Inserted ${inserted.length} wines:`);
  inserted.forEach((w) => {
    const vintage = w.vintage ? ` ${w.vintage}` : "";
    console.log(`  - [${w.status}] ${w.name}${vintage} (${w.type}, qty: ${w.quantity})`);
  });

  await mongoose.disconnect();
  console.log("Done. Database disconnected.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
