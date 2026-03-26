const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    reservationId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true, ref: "User" },
    restaurantId: { type: String, required: true, index: true, ref: "Restaurant" },
    restaurantName: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, default: 2 },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
    createdAt: { type: String, required: true },
  },
  { timestamps: true, collection: "Reservations" }
);

module.exports = mongoose.models.Reservation || mongoose.model("Reservation", reservationSchema);
