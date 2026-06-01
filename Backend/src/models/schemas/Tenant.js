const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    logo: {
      type: String, // URL
    },
    description: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street:  { type: String },
      city:    { type: String },
      state:   { type: String },
      zip:     { type: String },
      country: { type: String },
    },
    subscription: {
      plan:     { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
      status:   { type: String, enum: ["active", "suspended", "cancelled"], default: "active" },
      startDate: { type: Date },
      endDate:   { type: Date },
      maxProducts: { type: Number, default: 100 },
      maxUsers:    { type: Number, default: 5 },
    },
    settings: {
      currency:    { type: String, default: "USD" },
      timezone:    { type: String, default: "UTC" },
      language:    { type: String, default: "en" },
      theme:       { type: String, default: "light" },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tenant", tenantSchema);
