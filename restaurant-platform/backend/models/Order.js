const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true, ref: "User" },
    restaurantId: { type: String, required: true, index: true, ref: "Restaurant" },
    restaurantName: { type: String, required: true },
    items: { type: [mongoose.Schema.Types.Mixed], default: [] },
    total: { type: Number, required: true },
    orderNote: { type: String, default: "" },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, required: true },
    approvalStatus: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
    userDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
    tracking: { type: [String], default: [] },
    placedAt: { type: String, required: true },
  },
  { timestamps: true, collection: "Orders" }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
