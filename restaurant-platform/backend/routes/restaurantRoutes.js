const express = require("express");
const { createId, state } = require("../data/store");
const { requireAuth } = require("../middleware/authMiddleware");
const { logAdminRequest } = require("../utils/adminLog");
const { persistState } = require("../utils/persistence");

const router = express.Router();

function getRestaurantPosts(restaurantId) {
  return state.posts.filter(
    (post) => post.restaurantId === restaurantId && post.status !== "deleted"
  );
}

router.get("/", (req, res) => {
  res.json(
    state.restaurants
      .filter((restaurant) => restaurant.status === "approved")
      .map((restaurant) => ({
      ...restaurant,
      reviews: (restaurant.reviews || []).filter((review) => review.status !== "deleted"),
      posts: getRestaurantPosts(restaurant.id),
      }))
  );
});

router.get("/:id", (req, res) => {
  const restaurant = state.restaurants.find((item) => item.id === req.params.id && item.status === "approved");
  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }
  return res.json({
    ...restaurant,
    reviews: (restaurant.reviews || []).filter((review) => review.status !== "deleted"),
    posts: getRestaurantPosts(restaurant.id),
  });
});

router.post("/:id/reviews", requireAuth, async (req, res) => {
  const restaurant = state.restaurants.find((item) => item.id === req.params.id);
  const { rating, comment, image, itemId } = req.body || {};

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  if (!rating || !comment) {
    return res.status(400).json({ message: "Rating and comment are required" });
  }

  const review = {
    id: createId("review"),
    userId: req.user.id,
    userName: req.user.name,
    rating: Number(rating),
    comment,
    image: image || "",
    itemId: itemId || null,
    restaurantId: restaurant.id,
    status: "visible",
    createdAt: new Date().toISOString(),
  };
  review.reviewId = review.id;

  restaurant.reviews.unshift(review);
  state.reviews.unshift(review);
  req.user.reviewHistory = [review, ...(req.user.reviewHistory || [])];
  logAdminRequest({
    actorId: req.user.id,
    actorName: req.user.name,
    action: "create",
    resource: "review",
    details: { restaurantId: restaurant.id, reviewId: review.reviewId, itemId: review.itemId },
  });
  await persistState();
  return res.status(201).json({ message: "Review added", review });
});

router.post("/:id/bookings", requireAuth, async (req, res) => {
  const restaurant = state.restaurants.find((item) => item.id === req.params.id);
  const { type, date, time, guests, notes } = req.body || {};

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  if (!type || !date || !time) {
    return res.status(400).json({ message: "Type, date, and time are required" });
  }

  const booking = {
    id: createId("reservation"),
    userId: req.user.id,
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    restaurantStatus: restaurant.status,
    type,
    date,
    time,
    guests: guests || 2,
    notes: notes || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  booking.reservationId = booking.id;

  state.reservations.unshift(booking);
  req.user.reservations = [booking, ...(req.user.reservations || [])];
  logAdminRequest({
    actorId: req.user.id,
    actorName: req.user.name,
    action: "create",
    resource: "booking",
    details: { reservationId: booking.reservationId, restaurantId: restaurant.id, type },
  });
  await persistState();
  return res.status(201).json({ message: "Reservation request sent to the restaurant", booking });
});

module.exports = router;
