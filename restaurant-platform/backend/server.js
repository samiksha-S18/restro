const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const adminRoutes = require("./routes/adminRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");
const { connectDatabase } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/restaurantDB";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Hunger API",
    status: "running",
    routes: ["/api/auth", "/api/restaurants", "/api/cart", "/api/profile", "/api/posts"],
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/cart", orderRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/restaurant-admin", adminRoutes);
app.use("/api/super-admin", superAdminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

async function startServer() {
  const databaseConnected = await connectDatabase(MONGO_URI);

  if (databaseConnected) {
    console.log("MongoDB connected successfully.");
  } else {
    console.warn("MongoDB unavailable. Running with in-memory sample data.");
    console.warn("Set MONGO_URI to enable persistent database storage.");
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
