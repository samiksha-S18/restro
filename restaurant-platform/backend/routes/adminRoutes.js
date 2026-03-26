const express = require("express");
const { createTrackingPoint, state } = require("../data/store");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRestaurantAdmin } = require("../middleware/adminMiddleware");
const { persistState } = require("../utils/persistence");

const router = express.Router();

function getManagedRestaurant(adminUser) {
  const restaurantId = adminUser.restaurantId;
  return state.restaurants.find(
    (restaurant) =>
      (restaurant.restaurantId === restaurantId || restaurant.id === restaurantId) &&
      restaurant.managedBy === adminUser.id
  );
}

function pushNotification(userId, type, title, message, relatedId = "") {
  state.notifications.unshift({
    id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    userId,
    type,
    title,
    message,
    relatedId,
    isRead: false,
    createdAt: new Date().toISOString(),
  });
}

function syncOrderIntoUserHistory(order) {
  const user = state.users.find((item) => item.id === order.userId);
  if (!user) {
    return;
  }

  user.orderHistory = (user.orderHistory || []).map((item) =>
    item.orderId === order.orderId ? order : item
  );
}

function syncReservationIntoUserHistory(reservation) {
  const user = state.users.find((item) => item.id === reservation.userId);
  if (!user) {
    return;
  }

  user.reservations = (user.reservations || []).map((item) =>
    item.reservationId === reservation.reservationId ? reservation : item
  );
}

function syncReviewIntoUserHistory(review) {
  const user = state.users.find((item) => item.id === review.userId);
  if (!user) {
    return;
  }

  user.reviewHistory = (user.reviewHistory || []).map((item) =>
    item.reviewId === review.reviewId ? review : item
  );
}

function syncPostIntoUserHistory(post) {
  const user = state.users.find((item) => item.id === post.userId);
  if (!user) {
    return;
  }

  user.postHistory = (user.postHistory || []).map((item) =>
    item.postId === post.postId ? post : item
  );
}

function appendTrackingStatus(order, status) {
  order.status = status;
  state.orderStatusTracking.unshift(createTrackingPoint(status, order.orderId));
  syncOrderIntoUserHistory(order);
}

router.get("/dashboard", requireAuth, requireRestaurantAdmin, (req, res) => {
  const restaurant = getManagedRestaurant(req.user);

  if (!restaurant) {
    return res.status(404).json({ message: "Assigned restaurant not found" });
  }

  res.json({
    restaurant,
    orders: state.orders.filter((order) => order.restaurantId === restaurant.restaurantId),
    reservations: state.reservations.filter((reservation) => reservation.restaurantId === restaurant.restaurantId),
    reviews: state.reviews.filter((review) => review.restaurantId === restaurant.restaurantId),
    posts: state.posts.filter((post) => post.restaurantId === restaurant.restaurantId && post.status !== "deleted"),
  });
});

router.post("/menu-items", requireAuth, requireRestaurantAdmin, async (req, res) => {
  const restaurant = getManagedRestaurant(req.user);
  const { name, price, type = "veg", description = "", image = "", allergens = [] } = req.body || {};

  if (!restaurant) {
    return res.status(404).json({ message: "Assigned restaurant not found" });
  }

  if (!name || !price) {
    return res.status(400).json({ message: "Item name and price are required" });
  }

  const itemId = `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const menuItem = {
    id: itemId,
    itemId,
    name,
    price: Number(price),
    type,
    description,
    image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    allergens: Array.isArray(allergens) ? allergens : [],
    rating: 4.5,
  };

  restaurant.menu.unshift(menuItem);
  await persistState();
  res.status(201).json({ message: "Menu item added", menuItem });
});

router.put("/menu-items/:itemId", requireAuth, requireRestaurantAdmin, async (req, res) => {
  const restaurant = getManagedRestaurant(req.user);

  if (!restaurant) {
    return res.status(404).json({ message: "Assigned restaurant not found" });
  }

  const item = (restaurant.menu || []).find(
    (menuItem) => menuItem.itemId === req.params.itemId || menuItem.id === req.params.itemId
  );

  if (!item) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  Object.assign(item, {
    ...req.body,
    price: req.body?.price !== undefined ? Number(req.body.price) : item.price,
    allergens: Array.isArray(req.body?.allergens) ? req.body.allergens : item.allergens,
  });

  await persistState();
  res.json({ message: "Menu item updated", menuItem: item });
});

router.delete("/menu-items/:itemId", requireAuth, requireRestaurantAdmin, async (req, res) => {
  const restaurant = getManagedRestaurant(req.user);

  if (!restaurant) {
    return res.status(404).json({ message: "Assigned restaurant not found" });
  }

  restaurant.menu = (restaurant.menu || []).filter(
    (menuItem) => menuItem.itemId !== req.params.itemId && menuItem.id !== req.params.itemId
  );

  await persistState();
  res.json({ message: "Menu item deleted" });
});

router.patch("/orders/:orderId/decision", requireAuth, requireRestaurantAdmin, async (req, res) => {
  const restaurant = getManagedRestaurant(req.user);
  const { decision } = req.body || {};
  const order = state.orders.find((item) => item.orderId === req.params.orderId);

  if (!restaurant || !order || order.restaurantId !== restaurant.restaurantId) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (!["accepted", "rejected"].includes(decision)) {
    return res.status(400).json({ message: "Decision must be accepted or rejected" });
  }

  order.approvalStatus = decision === "accepted" ? "accepted" : "declined";
  appendTrackingStatus(order, decision === "accepted" ? "Accepted" : "Declined");

  pushNotification(
    order.userId,
    "order",
    decision === "accepted" ? "Order accepted" : "Order rejected",
    decision === "accepted" ? "Your order has been accepted." : "Your order has been rejected.",
    order.orderId
  );

  await persistState();
  res.json({ message: `Order ${decision}`, order });
});

router.patch("/orders/:orderId/deliver", requireAuth, requireRestaurantAdmin, async (req, res) => {
  const restaurant = getManagedRestaurant(req.user);
  const order = state.orders.find((item) => item.orderId === req.params.orderId);

  if (!restaurant || !order || order.restaurantId !== restaurant.restaurantId) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.approvalStatus !== "accepted") {
    return res.status(400).json({ message: "Only accepted orders can be progressed" });
  }

  const nextStatusByCurrentStatus = {
    Accepted: "Preparing",
    Preparing: "Out for Delivery",
    "Out for Delivery": "Delivered",
  };
  const nextStatus = nextStatusByCurrentStatus[order.status];

  if (!nextStatus) {
    return res.status(400).json({ message: "Order is already completed or cannot be progressed" });
  }

  order.approvalStatus = "accepted";
  appendTrackingStatus(order, nextStatus);

  const notificationMap = {
    Preparing: {
      title: "Order is being prepared",
      message: "Your order is now being prepared in the kitchen.",
    },
    "Out for Delivery": {
      title: "Order is out for delivery",
      message: "Your order is on the way.",
    },
    Delivered: {
      title: "Order delivered",
      message: "Your order has been delivered.",
    },
  };

  pushNotification(
    order.userId,
    "order",
    notificationMap[nextStatus].title,
    notificationMap[nextStatus].message,
    order.orderId
  );

  await persistState();
  res.json({ message: `Order moved to ${nextStatus}`, order });
});

router.patch("/reservations/:reservationId/decision", requireAuth, requireRestaurantAdmin, async (req, res) => {
  const restaurant = getManagedRestaurant(req.user);
  const { decision } = req.body || {};
  const reservation = state.reservations.find((item) => item.reservationId === req.params.reservationId);

  if (!restaurant || !reservation || reservation.restaurantId !== restaurant.restaurantId) {
    return res.status(404).json({ message: "Reservation not found" });
  }

  if (!["approved", "rejected"].includes(decision)) {
    return res.status(400).json({ message: "Decision must be approved or rejected" });
  }

  reservation.status = decision;
  syncReservationIntoUserHistory(reservation);

  pushNotification(
    reservation.userId,
    "reservation",
    decision === "approved" ? "Reservation approved" : "Reservation rejected",
    decision === "approved" ? "Your reservation has been approved." : "Your reservation has been rejected.",
    reservation.reservationId
  );

  await persistState();
  res.json({ message: `Reservation ${decision}`, reservation });
});

router.patch("/reviews/:reviewId/status", requireAuth, requireRestaurantAdmin, async (req, res) => {
  const restaurant = getManagedRestaurant(req.user);
  const { status } = req.body || {};
  const review = state.reviews.find((item) => item.reviewId === req.params.reviewId);

  if (!restaurant || !review || review.restaurantId !== restaurant.restaurantId) {
    return res.status(404).json({ message: "Review not found" });
  }

  if (!["visible", "deleted"].includes(status)) {
    return res.status(400).json({ message: "Review status must be visible or deleted" });
  }

  review.status = status;
  const restaurantReview = (restaurant.reviews || []).find((item) => item.reviewId === review.reviewId);
  if (restaurantReview) {
    restaurantReview.status = status;
  }
  syncReviewIntoUserHistory(review);

  await persistState();
  res.json({ message: "Review status updated", review });
});

router.patch("/posts/:postId/status", requireAuth, requireRestaurantAdmin, async (req, res) => {
  const restaurant = getManagedRestaurant(req.user);
  const { status } = req.body || {};
  const post = state.posts.find((item) => item.postId === req.params.postId);

  if (!restaurant || !post || post.restaurantId !== restaurant.restaurantId) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!["kept", "deleted"].includes(status)) {
    return res.status(400).json({ message: "Post status must be kept or deleted" });
  }

  post.status = status;
  syncPostIntoUserHistory(post);

  await persistState();
  res.json({ message: "Post status updated", post });
});

module.exports = router;
