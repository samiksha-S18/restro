const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true, ref: "User" },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedId: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
    createdAt: { type: String, required: true },
  },
  { timestamps: true, collection: "Notifications" }
);

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
