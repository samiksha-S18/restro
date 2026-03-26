const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["super_admin", "restaurant_admin", "user"], default: "user", index: true },
    restaurantId: { type: String, default: null, index: true, ref: "Restaurant" },
    isBlocked: { type: Boolean, default: false, index: true },
    avatar: { type: String, default: "U" },
    allergies: { type: [String], default: [] },
    settings: {
      notifications: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: false },
    },
    postHistory: { type: [mongoose.Schema.Types.Mixed], default: [] },
    orderHistory: { type: [mongoose.Schema.Types.Mixed], default: [] },
    reservations: { type: [mongoose.Schema.Types.Mixed], default: [] },
    reviewHistory: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true, collection: "Users" }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
