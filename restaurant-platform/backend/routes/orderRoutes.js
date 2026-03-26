const express = require("express");
const {
  createId,
  createTrackingPoint,
  state,
} = require("../data/store");
const { requireAuth } = require("../middleware/authMiddleware");
const { logAdminRequest } = require("../utils/adminLog");
const { persistState } = require("../utils/persistence");

const router = express.Router();

const ACTIVE_USER_STATUSES = ["Pending", "Accepted", "Preparing", "Out for Delivery"];

function getCart(userId) {
  if (!state.carts[userId]) {
    state.carts[userId] = [];
  }
  return state.carts[userId];
}

function findMenuItem(restaurantId, itemId) {
  const restaurant = state.restaurants.find((item) => item.id === restaurantId && item.status === "approved");
  const menuItem = restaurant?.menu.find((item) => item.itemId === itemId || item.id === itemId);
  return { restaurant, menuItem };
}

function updatePreferenceFromOrder(user, order) {
  const preference = state.userPreferences.find((item) => item.userId === user.id);
  if (!preference) {
    return;
  }

  const orderedItemNames = order.items.map((item) => item.name);
  preference.favoriteItems = [...new Set([...(preference.favoriteItems || []), ...orderedItemNames])];
  preference.frequentlyOrderedItems = [...(preference.frequentlyOrderedItems || []), ...orderedItemNames];
  preference.updatedAt = new Date().toISOString();
}

router.get("/", requireAuth, (req, res) => {
  res.json({ items: getCart(req.user.id) });
});

router.post("/", requireAuth, async (req, res) => {
  const { restaurantId, itemId, quantity = 1 } = req.body || {};
  const { restaurant, menuItem } = findMenuItem(restaurantId, itemId);

  if (!restaurant || !menuItem) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  const cart = getCart(req.user.id);
  const existing = cart.find((item) => item.itemId === menuItem.itemId);

  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.push({
      id: createId("cart-item"),
      itemId: menuItem.itemId,
      restaurantId: restaurant.restaurantId,
      restaurantName: restaurant.name,
      name: menuItem.name,
      price: menuItem.price,
      type: menuItem.type,
      quantity: Number(quantity),
    });
  }

  logAdminRequest({
    actorId: req.user.id,
    actorName: req.user.name,
    action: "add",
    resource: "cart",
    details: { restaurantId, itemId: menuItem.itemId, quantity: Number(quantity) },
  });

  await persistState();
  return res.status(201).json({ message: "Item added to cart", items: cart });
});

router.patch("/:itemId", requireAuth, async (req, res) => {
  const cart = getCart(req.user.id);
  const item = cart.find((entry) => entry.id === req.params.itemId || entry.itemId === req.params.itemId);

  if (!item) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  item.quantity = Number(req.body?.quantity || item.quantity);

  if (item.quantity <= 0) {
    state.carts[req.user.id] = cart.filter((entry) => entry.id !== item.id);
  }

  logAdminRequest({
    actorId: req.user.id,
    actorName: req.user.name,
    action: "update",
    resource: "cart",
    details: { itemId: item.itemId, quantity: item.quantity },
  });

  await persistState();
  return res.json({ message: "Cart updated", items: getCart(req.user.id) });
});

router.delete("/:itemId", requireAuth, async (req, res) => {
  state.carts[req.user.id] = getCart(req.user.id).filter(
    (entry) => entry.id !== req.params.itemId && entry.itemId !== req.params.itemId
  );
  logAdminRequest({
    actorId: req.user.id,
    actorName: req.user.name,
    action: "remove",
    resource: "cart",
    details: { itemId: req.params.itemId },
  });
  await persistState();
  return res.json({ message: "Item removed", items: getCart(req.user.id) });
});

router.post("/checkout", requireAuth, async (req, res) => {
  const cart = getCart(req.user.id);
  const { address, paymentMethod, orderNote = "" } = req.body || {};

  if (!cart.length) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const restaurant = state.restaurants.find((item) => item.restaurantId === cart[0].restaurantId || item.id === cart[0].restaurantId);
  if (!restaurant || restaurant.status !== "approved") {
    return res.status(400).json({ message: "This restaurant is currently unavailable for ordering." });
  }

  if (!address || !paymentMethod) {
    return res.status(400).json({ message: "Address and payment method are required" });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 49;
  // Orders always carry the restaurant id so downstream role checks stay isolated.
  const order = {
    id: createId("order"),
    userId: req.user.id,
    restaurantId: cart[0].restaurantId,
    restaurantName: cart[0].restaurantName,
    total,
    orderNote,
    status: "Pending",
    approvalStatus: "pending",
    tracking: ["Preparing", "Out for Delivery", "Delivered"],
    address,
    paymentMethod,
    placedAt: new Date().toISOString(),
    items: cart.map((item) => ({
      itemId: item.itemId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    userDetails: {
      userId: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  };
  order.orderId = order.id;

  req.user.orderHistory.unshift(order);
  state.orders.unshift(order);
  state.orderStatusTracking.unshift(createTrackingPoint("Pending", order.orderId));
  updatePreferenceFromOrder(req.user, order);
  state.carts[req.user.id] = [];

  logAdminRequest({
    actorId: req.user.id,
    actorName: req.user.name,
    action: "checkout",
    resource: "order",
    details: { orderId: order.orderId, total, orderNote },
  });

  await persistState();

  return res.status(201).json({
    message: "Order placed and sent to the restaurant",
    order,
  });
});

router.get("/orders/active", requireAuth, (req, res) => {
  const orders = state.orders.filter(
    (order) =>
      order.userId === req.user.id &&
      ACTIVE_USER_STATUSES.includes(order.status)
  );

  res.json({ orders });
});

module.exports = router;
