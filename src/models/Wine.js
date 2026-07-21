const mongoose = require("mongoose");

const currentYear = new Date().getFullYear();

const wineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
    producer: {
      type: String,
      required: [true, "Producer is required"],
      trim: true,
      maxlength: [200, "Producer cannot exceed 200 characters"],
    },
    vintage: {
      type: Number,
      min: [1900, "Vintage must be 1900 or later"],
      max: [currentYear + 1, `Vintage cannot exceed ${currentYear + 1}`],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: ["Red", "White", "Rosé", "Sparkling", "Dessert", "Fortified"],
        message: "{VALUE} is not a valid wine type",
      },
    },
    grape: {
      type: String,
      trim: true,
      maxlength: [200, "Grape cannot exceed 200 characters"],
      default: "",
    },
    region: {
      type: String,
      trim: true,
      maxlength: [200, "Region cannot exceed 200 characters"],
      default: "",
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, "Country cannot exceed 100 characters"],
      default: "",
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 1,
    },
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
      default: "",
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["In Cellar", "Consumed", "Wishlist"],
        message: "{VALUE} is not a valid status",
      },
      default: "In Cellar",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common query patterns
wineSchema.index({ type: 1 });
wineSchema.index({ status: 1 });
wineSchema.index({ name: "text", producer: "text" });

const Wine = mongoose.model("Wine", wineSchema);

module.exports = Wine;
