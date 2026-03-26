const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    restaurantId: { type: String, required: true, index: true, ref: "Restaurant" },
    code: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { timestamps: true, collection: "Offers" }
);

module.exports = mongoose.models.Offer || mongoose.model("Offer", offerSchema);
