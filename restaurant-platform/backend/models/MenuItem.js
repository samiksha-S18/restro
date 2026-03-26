const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true, unique: true, index: true },
    restaurantId: { type: String, required: true, index: true, ref: "Restaurant" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    allergens: { type: [String], default: [] },
    rating: Number,
    image: String,
    description: String,
  },
  { timestamps: true, collection: "Menu Items" }
);

module.exports = mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema);
