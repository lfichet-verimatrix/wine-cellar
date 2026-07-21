const Wine = require("../models/Wine");
const { NotFoundError } = require("../utils/errors");

/**
 * Get all wines, optionally filtered by type, status, and/or search term.
 */
async function getAllWines(filter = {}) {
  const query = {};

  if (filter.type) {
    query.type = filter.type;
  }

  if (filter.status) {
    query.status = filter.status;
  }

  if (filter.search) {
    const searchTerm = filter.search.trim();
    if (searchTerm.length >= 3) {
      // Use MongoDB text index for terms >= 3 characters
      query.$text = { $search: searchTerm };
    } else {
      // Regex fallback for short terms (case-insensitive partial match)
      const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [{ name: regex }, { producer: regex }];
    }
  }

  return Wine.find(query).sort({ createdAt: -1 });
}

/**
 * Get a single wine by ID.
 */
async function getWineById(id) {
  const wine = await Wine.findById(id);
  if (!wine) {
    throw new NotFoundError(`Wine with id "${id}" not found`);
  }
  return wine;
}

/**
 * Create a new wine.
 */
async function createWine(data) {
  const wine = new Wine(data);
  return wine.save();
}

/**
 * Update an existing wine by ID.
 */
async function updateWine(id, data) {
  const wine = await Wine.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!wine) {
    throw new NotFoundError(`Wine with id "${id}" not found`);
  }
  return wine;
}

/**
 * Delete a wine by ID.
 */
async function deleteWine(id) {
  const wine = await Wine.findByIdAndDelete(id);
  if (!wine) {
    throw new NotFoundError(`Wine with id "${id}" not found`);
  }
  return wine;
}

module.exports = {
  getAllWines,
  getWineById,
  createWine,
  updateWine,
  deleteWine,
};
