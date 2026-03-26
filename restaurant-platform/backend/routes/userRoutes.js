const express = require("express");
const { createId, getPublicUser, state } = require("../data/store");
const { requireAuth } = require("../middleware/authMiddleware");
const { logAdminRequest } = require("../utils/adminLog");
const { persistState } = require("../utils/persistence");

const router = express.Router();

const moodFilters = {
  Happy: ["pizza", "dessert", "biryani", "wrap"],
  Sad: ["paneer", "naan", "pizza", "tiramisu"],
  Angry: ["biryani", "pepperoni", "spicy", "naan"],
  Stressed: ["salad", "juice", "quinoa", "wrap"],
  "Party Mood": ["pizza", "biryani", "dessert", "pepperoni"],
  Romantic: ["truffle", "tiramisu", "wrap", "pizza"],
};

function getUserPreference(userId) {
  return state.userPreferences.find((item) => item.userId === userId);
}

function createProfileUser(user) {
  const publicUser = getPublicUser(user);
  const reservations = state.reservations.filter((booking) => booking.userId === user.id);
  const notifications = state.notifications.filter((item) => item.userId === user.id);
  const preference = getUserPreference(user.id);

  return {
    ...publicUser,
    postHistory: user.postHistory || [],
    orderHistory: user.orderHistory || [],
    bookings: reservations,
    reservations,
    reviewHistory: user.reviewHistory || [],
    notifications,
    preference,
  };
}

router.get("/", requireAuth, (req, res) => {
  res.json({ user: createProfileUser(req.user) });
});

router.put("/allergies", requireAuth, async (req, res) => {
  req.user.allergies = Array.isArray(req.body?.allergies) ? req.body.allergies : [];
  logAdminRequest({
    actorId: req.user.id,
    actorName: req.user.name,
    action: "update",
    resource: "allergies",
    details: { allergies: req.user.allergies },
  });
  await persistState();
  res.json({ message: "Allergies updated", allergies: req.user.allergies });
});

router.put("/settings", requireAuth, async (req, res) => {
  req.user.settings = {
    ...req.user.settings,
    ...(req.body?.settings || {}),
  };

  const preference = getUserPreference(req.user.id);
  if (preference) {
    preference.theme = req.user.settings.darkMode ? "dark" : "light";
    preference.updatedAt = new Date().toISOString();
  }

  logAdminRequest({
    actorId: req.user.id,
    actorName: req.user.name,
    action: "update",
    resource: "settings",
    details: { settings: req.user.settings },
  });

  await persistState();
  res.json({ message: "Settings updated", settings: req.user.settings });
});

router.get("/orders", requireAuth, (req, res) => {
  res.json({ orders: req.user.orderHistory || [] });
});

router.get("/bookings", requireAuth, (req, res) => {
  res.json({ bookings: state.reservations.filter((booking) => booking.userId === req.user.id) });
});

router.get("/notifications", requireAuth, (req, res) => {
  res.json({ notifications: state.notifications.filter((item) => item.userId === req.user.id) });
});

router.patch("/notifications/:id/read", requireAuth, async (req, res) => {
  const notification = state.notifications.find(
    (item) => item.id === req.params.id && item.userId === req.user.id
  );

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  notification.isRead = true;
  await persistState();
  return res.json({ message: "Notification marked as read", notification });
});

router.post("/recommendations", requireAuth, async (req, res) => {
  const { mood } = req.body || {};
  const preference = getUserPreference(req.user.id);
  const frequentItems = preference?.frequentlyOrderedItems || [];
  const keywords = moodFilters[mood] || [];

  const recommendations = state.restaurants.filter((restaurant) => restaurant.status === "approved").flatMap((restaurant) =>
    restaurant.menu.map((item) => {
      const name = item.name.toLowerCase();
      const moodScore = keywords.reduce((score, keyword) => score + (name.includes(keyword.toLowerCase()) ? 5 : 0), 0);
      const historyScore = frequentItems.reduce(
        (score, entry) => score + (entry.toLowerCase().includes(name) || name.includes(entry.toLowerCase()) ? 3 : 0),
        0
      );
      const preferencePenalty = (req.user.allergies || []).some((allergy) => item.allergens.includes(allergy)) ? -10 : 0;

      return {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        type: item.type,
        image: item.image,
        score: moodScore + historyScore + item.rating + preferencePenalty,
      };
    })
  )
    .sort((left, right) => right.score - left.score)
    .slice(0, 5);

  if (preference) {
    preference.moods = [
      {
        id: createId("mood"),
        mood,
        createdAt: new Date().toISOString(),
      },
      ...(preference.moods || []),
    ].slice(0, 12);
    preference.updatedAt = new Date().toISOString();
  }

  logAdminRequest({
    actorId: req.user.id,
    actorName: req.user.name,
    action: "recommend",
    resource: "ai",
    details: { mood, recommendationCount: recommendations.length },
  });

  await persistState();
  res.json({ mood, recommendations, preference });
});

module.exports = router;
