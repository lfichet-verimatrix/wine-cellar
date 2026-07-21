const { z } = require("zod");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const currentYear = new Date().getFullYear();

const wineTypes = ["Red", "White", "Rosé", "Sparkling", "Dessert", "Fortified"];
const wineStatuses = ["In Cellar", "Consumed", "Wishlist"];

// --- Param schemas ---

const wineIdParam = z.object({
  id: z.string().regex(objectIdRegex, "Invalid wine ID format"),
});

// --- Body schemas ---

const createWineBody = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name cannot be empty")
    .max(200, "Name cannot exceed 200 characters"),
  producer: z
    .string({ required_error: "Producer is required" })
    .min(1, "Producer cannot be empty")
    .max(200, "Producer cannot exceed 200 characters"),
  vintage: z
    .number({ invalid_type_error: "Vintage must be a number" })
    .int("Vintage must be an integer")
    .min(1900, "Vintage must be 1900 or later")
    .max(currentYear + 1, `Vintage cannot exceed ${currentYear + 1}`)
    .optional(),
  type: z.enum(wineTypes, {
    required_error: "Type is required",
    invalid_type_error: "Invalid wine type",
  }),
  grape: z.string().max(200, "Grape cannot exceed 200 characters").optional().default(""),
  region: z.string().max(200, "Region cannot exceed 200 characters").optional().default(""),
  country: z.string().max(100, "Country cannot exceed 100 characters").optional().default(""),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative")
    .optional()
    .default(1),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price cannot be negative")
    .optional(),
  rating: z
    .number({ invalid_type_error: "Rating must be a number" })
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .optional(),
  notes: z.string().max(2000, "Notes cannot exceed 2000 characters").optional().default(""),
  status: z
    .enum(wineStatuses, {
      invalid_type_error: "Invalid status",
    })
    .optional()
    .default("In Cellar"),
});

const updateWineBody = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(200, "Name cannot exceed 200 characters")
    .optional(),
  producer: z
    .string()
    .min(1, "Producer cannot be empty")
    .max(200, "Producer cannot exceed 200 characters")
    .optional(),
  vintage: z
    .number({ invalid_type_error: "Vintage must be a number" })
    .int("Vintage must be an integer")
    .min(1900, "Vintage must be 1900 or later")
    .max(currentYear + 1, `Vintage cannot exceed ${currentYear + 1}`)
    .optional(),
  type: z
    .enum(wineTypes, {
      invalid_type_error: "Invalid wine type",
    })
    .optional(),
  grape: z.string().max(200, "Grape cannot exceed 200 characters").optional(),
  region: z.string().max(200, "Region cannot exceed 200 characters").optional(),
  country: z.string().max(100, "Country cannot exceed 100 characters").optional(),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative")
    .optional(),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price cannot be negative")
    .optional(),
  rating: z
    .number({ invalid_type_error: "Rating must be a number" })
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .optional(),
  notes: z.string().max(2000, "Notes cannot exceed 2000 characters").optional(),
  status: z
    .enum(wineStatuses, {
      invalid_type_error: "Invalid status",
    })
    .optional(),
});

// --- Query schemas ---

const getWinesQuery = z.object({
  type: z.enum(wineTypes).optional(),
  status: z.enum(wineStatuses).optional(),
  search: z.string().max(200, "Search term cannot exceed 200 characters").optional(),
});

// --- Composed schemas for the validate middleware ---

const getWinesSchema = { query: getWinesQuery };
const getWineByIdSchema = { params: wineIdParam };
const createWineSchema = { body: createWineBody };
const updateWineSchema = { params: wineIdParam, body: updateWineBody };
const deleteWineSchema = { params: wineIdParam };

module.exports = {
  getWinesSchema,
  getWineByIdSchema,
  createWineSchema,
  updateWineSchema,
  deleteWineSchema,
};
