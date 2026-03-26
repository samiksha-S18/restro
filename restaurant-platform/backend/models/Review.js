const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true, ref: "User" },
    restaurantId: { type: String, required: true, index: true, ref: "Restaurant" },
    itemId: { type: String, index: true, ref: "MenuItem" },
    userName: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    image: { type: String, default: "" },
    status: { type: String, enum: ["visible", "deleted"], default: "visible" },
    createdAt: { type: String, required: true },
  },
  { timestamps: true, collection: "Reviews" }
);

module.exports = mongoose.models.Review || mongoose.model("Review", reviewSchema);
