const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  name:     { type: String, required: true },  // e.g. "Red / XL"
  sku:      { type: String },
  price:    { type: Number, required: true, min: 0 },
  stock:    { type: Number, default: 0, min: 0 },
  attributes: { type: Map, of: String },       // { color: "Red", size: "XL" }
});

const productSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    tags: [{ type: String }],
    images: [{ type: String }], // URLs
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sku: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    variants: [variantSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    meta: {
      title:       { type: String },
      description: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// Slug must be unique per tenant
productSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);
