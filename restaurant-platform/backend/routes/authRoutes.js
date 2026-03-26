const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createId, ensureUserCollections, getPublicUser, state } = require("../data/store");
const { requireAuth } = require("../middleware/authMiddleware");
const { logAdminRequest } = require("../utils/adminLog");
const { persistState } = require("../utils/persistence");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "restaurant-platform-dev-secret";

function createAuthToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role || (user.isAdmin ? "super_admin" : "user"),
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

async function passwordMatches(user, password) {
  if (typeof user.password !== "string") {
    return false;
  }

  if (user.password.startsWith("$2")) {
    return bcrypt.compare(password, user.password);
  }

  return user.password === password;
}

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  if (state.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const user = {
    id: createId("user"),
    name: String(name).trim(),
    email: String(email).trim(),
    password: await bcrypt.hash(password, 10),
    role: "user",
    isAdmin: false,
    avatar: name.trim().charAt(0).toUpperCase() || "U",
    allergies: [],
    settings: {
      notifications: true,
      darkMode: false,
    },
    postHistory: [],
    orderHistory: [],
    reservations: [],
    reviewHistory: [],
  };

  ensureUserCollections(user);
  state.users.push(user);
  state.carts[user.id] = [];
  state.userPreferences.push({
    id: `pref-${user.id}`,
    userId: user.id,
    theme: "light",
    favoriteItems: [],
    frequentlyOrderedItems: [],
    moods: [],
    updatedAt: new Date().toISOString(),
  });

  const token = createAuthToken(user);

  logAdminRequest({
    actorId: user.id,
    actorName: user.name,
    action: "signup",
    resource: "auth",
    details: { email: user.email, role: "user" },
  });

  await persistState();

  return res.status(201).json({
    message: "Signup successful",
    token,
    user: getPublicUser(user),
  });
});

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body || {};
  const user = state.users.find((item) => item.email.toLowerCase() === String(email).toLowerCase());

  if (!user || !(await passwordMatches(user, password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.isBlocked) {
    return res.status(403).json({ message: "This account has been blocked. Contact support." });
  }

  const normalizedRole = ["super_admin", "restaurant_admin", "user"].includes(role) ? role : "user";
  if ((user.role || (user.isAdmin ? "super_admin" : "user")) !== normalizedRole) {
    return res.status(403).json({ message: `This account is not registered as ${normalizedRole}.` });
  }

  if (typeof user.password === "string" && !user.password.startsWith("$2")) {
    user.password = await bcrypt.hash(password, 10);
  }

  const token = createAuthToken(user);

  logAdminRequest({
    actorId: user.id,
    actorName: user.name,
    action: "login",
    resource: "auth",
    details: { email: user.email, role: normalizedRole },
  });

  await persistState();

  return res.json({
    message: "Login successful",
    token,
    user: getPublicUser(user),
  });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: getPublicUser(req.user) });
});

module.exports = router;
