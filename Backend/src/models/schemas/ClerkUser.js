const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      sparse: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String, // URL from Clerk or OAuth provider
    },
    provider: {
      type: String,
      enum: ["email", "google", "facebook", "github"],
      default: "email",
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      country: { type: String },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["admin", "vendor", "customer"],
      default: "customer",
    },
    metadata: {
      lastLogin: { type: Date },
      loginCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ email: 1, clerkId: 1 });
userSchema.index({ provider: 1 });

module.exports = mongoose.model("ClerkUser", userSchema);
