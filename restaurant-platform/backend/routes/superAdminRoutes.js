const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireSuperAdmin } = require("../middleware/adminMiddleware");
const { persistState } = require("../utils/persistence");
const { state } = require("../data/store");

const router = express.Router();

function getTotalRevenue() {
  return state.orders
    .filter((order) => order.approvalStatus !== "declined")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);
}

function syncReviewEverywhere(review) {
  state.restaurants.forEach((restaurant) => {
    restaurant.reviews = (restaurant.reviews || []).map((item) =>
      item.reviewId === review.reviewId ? review : item
    );
  });

  const user = state.users.find((item) => item.id === review.userId);
  if (user) {
    user.reviewHistory = (user.reviewHistory || []).map((item) =>
      item.reviewId === review.reviewId ? review : item
    );
  }
}

function syncPostEverywhere(post) {
  const user = state.users.find((item) => item.id === post.userId);
  if (user) {
    user.postHistory = (user.postHistory || []).map((item) =>
      item.postId === post.postId ? post : item
    );
  }
}

router.get("/dashboard", requireAuth, requireSuperAdmin, (req, res) => {
  res.json({
    overview: {
      totalUsers: state.users.filter((user) => user.role === "user").length,
      totalRestaurants: state.restaurants.length,
      totalOrders: state.orders.length,
      totalRevenue: getTotalRevenue(),
      totalReviews: state.reviews.filter((review) => review.status !== "deleted").length,
      totalPosts: state.posts.filter((post) => post.status !== "deleted").length,
    },
    restaurants: state.restaurants.map((restaurant) => ({
      ...restaurant,
      adminUser: state.users.find((user) => user.id === restaurant.managedBy) || null,
    })),
    users: state.users.filter((user) => user.role === "user"),
    orders: [...state.orders].sort((left, right) => new Date(right.placedAt) - new Date(left.placedAt)),
    reviews: [...state.reviews].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
    posts: [...state.posts].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
    actions: [...state.adminRequests].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)).slice(0, 20),
  });
});

router.patch("/restaurants/:restaurantId/status", requireAuth, requireSuperAdmin, async (req, res) => {
  const { status } = req.body || {};
  const restaurant = state.restaurants.find(
    (item) => item.restaurantId === req.params.restaurantId || item.id === req.params.restaurantId
  );

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  if (!["approved", "blocked", "suspended"].includes(status)) {
    return res.status(400).json({ message: "Unsupported restaurant status" });
  }

  restaurant.status = status;
  await persistState();
  res.json({ message: "Restaurant status updated", restaurant });
});

router.patch("/users/:userId/status", requireAuth, requireSuperAdmin, async (req, res) => {
  const { action } = req.body || {};
  const user = state.users.find((item) => item.id === req.params.userId);

  if (!user || user.role !== "user") {
    return res.status(404).json({ message: "User not found" });
  }

  if (!["block", "unblock"].includes(action)) {
    return res.status(400).json({ message: "Action must be block or unblock" });
  }

  user.isBlocked = action === "block";
  await persistState();
  res.json({ message: `User ${action}ed`, user });
});

router.patch("/reviews/:reviewId/status", requireAuth, requireSuperAdmin, async (req, res) => {
  const { status } = req.body || {};
  const review = state.reviews.find((item) => item.reviewId === req.params.reviewId);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  if (!["visible", "deleted"].includes(status)) {
    return res.status(400).json({ message: "Review status must be visible or deleted" });
  }

  review.status = status;
  syncReviewEverywhere(review);
  await persistState();
  res.json({ message: "Review status updated", review });
});

router.patch("/posts/:postId/status", requireAuth, requireSuperAdmin, async (req, res) => {
  const { status } = req.body || {};
  const post = state.posts.find((item) => item.postId === req.params.postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!["kept", "deleted"].includes(status)) {
    return res.status(400).json({ message: "Post status must be kept or deleted" });
  }

  post.status = status;
  syncPostEverywhere(post);
  await persistState();
  res.json({ message: "Post status updated", post });
});

module.exports = router;
