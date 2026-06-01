const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId, // ref to embedded variant
  },
  name:      { type: String, required: true }, // snapshot at time of order
  sku:       { type: String },
  price:     { type: Number, required: true, min: 0 },
  quantity:  { type: Number, required: true, min: 1 },
  subtotal:  { type: Number, required: true, min: 0 },
});

const orderSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },
    items: {
      type: [orderItemSchema],
      validate: [(v) => v.length > 0, "Order must have at least one item"],
    },
    shippingAddress: {
      name:    { type: String, required: true },
      street:  { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String },
      zip:     { type: String, required: true },
      country: { type: String, required: true },
      phone:   { type: String },
    },
    payment: {
      method:        { type: String, enum: ["card", "cash", "wallet", "bank_transfer"] },
      status:        { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
      transactionId: { type: String },
      paidAt:        { type: Date },
    },
    pricing: {
      subtotal:     { type: Number, required: true, min: 0 },
      tax:          { type: Number, default: 0, min: 0 },
      shippingCost: { type: Number, default: 0, min: 0 },
      discount:     { type: Number, default: 0, min: 0 },
      total:        { type: Number, required: true, min: 0 },
    },
    couponCode: { type: String },
    notes:      { type: String },
    statusHistory: [
      {
        status:    { type: String },
        changedAt: { type: Date, default: Date.now },
        note:      { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// orderNumber unique per tenant
orderSchema.index({ tenantId: 1, orderNumber: 1 }, { unique: true });

// Auto-generate orderNumber before saving
orderSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  const count = await this.constructor.countDocuments({ tenantId: this.tenantId });
  this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(5, "0")}`;
  next();
});

module.exports = mongoose.model("Order", orderSchema);
