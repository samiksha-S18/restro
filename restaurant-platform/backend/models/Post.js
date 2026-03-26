const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true, ref: "User" },
    restaurantId: { type: String, required: true, index: true, ref: "Restaurant" },
    userName: { type: String, required: true },
    restaurantName: { type: String, required: true },
    caption: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, default: "image" },
    taggedUsers: { type: [String], default: [] },
    status: { type: String, enum: ["pending", "kept", "deleted"], default: "kept" },
    createdAt: { type: String, required: true },
  },
  { timestamps: true, collection: "Posts" }
);

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);
