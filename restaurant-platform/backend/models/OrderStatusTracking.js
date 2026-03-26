const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderId: { type: String, required: true, index: true, ref: "Order" },
    status: { type: String, required: true },
    coordinates: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedAt: { type: String, required: true },
  },
  { timestamps: true, collection: "OrderStatusTracking" }
);

module.exports = mongoose.models.OrderStatusTracking || mongoose.model("OrderStatusTracking", trackingSchema);
