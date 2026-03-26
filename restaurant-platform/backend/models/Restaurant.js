const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    restaurantId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    cuisine: String,
    rating: Number,
    deliveryTime: String,
    priceForTwo: Number,
    distance: String,
    badge: String,
    location: String,
    status: { type: String, enum: ["pending", "approved", "blocked", "suspended"], default: "approved", index: true },
    accent: String,
    coverImage: String,
    managedBy: { type: String, default: null, index: true, ref: "User" },
    media: { type: [mongoose.Schema.Types.Mixed], default: [] },
    menu: { type: [mongoose.Schema.Types.Mixed], default: [] },
    reviews: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true, collection: "Restaurants" }
);

module.exports = mongoose.models.Restaurant || mongoose.model("Restaurant", restaurantSchema);
