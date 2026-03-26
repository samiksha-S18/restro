const mongoose = require("mongoose");

const userPreferenceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, unique: true, index: true, ref: "User" },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    favoriteItems: { type: [String], default: [] },
    frequentlyOrderedItems: { type: [String], default: [] },
    moods: { type: [mongoose.Schema.Types.Mixed], default: [] },
    updatedAt: { type: String, required: true },
  },
  { timestamps: true, collection: "UserPreferences" }
);

module.exports = mongoose.models.UserPreference || mongoose.model("UserPreference", userPreferenceSchema);
