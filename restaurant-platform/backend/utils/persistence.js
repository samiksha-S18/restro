const mongoose = require("mongoose");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");
const Reservation = require("../models/Reservation");
const Review = require("../models/Review");
const Post = require("../models/Post");
const Offer = require("../models/Offer");
const UserPreference = require("../models/UserPreference");
const OrderStatusTracking = require("../models/OrderStatusTracking");
const Notification = require("../models/Notification");
const { normalizeState, recomputeNextId, state } = require("../data/store");

function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

async function replaceCollection(Model, docs, uniqueField) {
  if (!isDatabaseReady()) {
    return;
  }

  const identifiers = docs
    .map((doc) => doc[uniqueField])
    .filter(Boolean);

  if (!identifiers.length) {
    await Model.deleteMany({});
    return;
  }

  await Model.bulkWrite(
    docs.map((doc) => ({
      updateOne: {
        filter: { [uniqueField]: doc[uniqueField] },
        update: { $set: doc },
        upsert: true,
      },
    })),
    { ordered: false }
  );
  await Model.deleteMany({ [uniqueField]: { $nin: identifiers } });
}

async function loadStateFromDatabase() {
  if (!isDatabaseReady()) {
    return false;
  }

  const [users, restaurants, orders, reservations, posts, offers, preferences, tracking, notifications, reviews] = await Promise.all([
    User.find({}).lean(),
    Restaurant.find({}).lean(),
    Order.find({}).lean(),
    Reservation.find({}).lean(),
    Post.find({}).lean(),
    Offer.find({}).lean(),
    UserPreference.find({}).lean(),
    OrderStatusTracking.find({}).lean(),
    Notification.find({}).lean(),
    Review.find({}).lean(),
  ]);

  if (!users.length) {
    return false;
  }

  state.users = users.map(({ _id, __v, ...user }) => user);
  state.restaurants = restaurants.map(({ _id, __v, ...restaurant }) => restaurant);
  state.orders = orders.map(({ _id, __v, ...order }) => order);
  state.reservations = reservations.map(({ _id, __v, ...reservation }) => reservation);
  state.posts = posts.map(({ _id, __v, ...post }) => post);
  state.offers = offers.map(({ _id, __v, ...offer }) => offer);
  state.userPreferences = preferences.map(({ _id, __v, ...preference }) => preference);
  state.orderStatusTracking = tracking.map(({ _id, __v, ...item }) => item);
  state.notifications = notifications.map(({ _id, __v, ...notification }) => notification);
  state.reviews = reviews.map(({ _id, __v, ...review }) => review);
  normalizeState();
  recomputeNextId();
  return true;
}

async function persistState() {
  if (!isDatabaseReady()) {
    return;
  }

  const menuItems = state.restaurants.flatMap((restaurant) =>
    (restaurant.menu || []).map((item) => ({
      ...item,
      itemId: item.itemId || item.id,
      restaurantId: restaurant.restaurantId || restaurant.id,
    }))
  );

  await Promise.all([
    replaceCollection(User, state.users, "id"),
    replaceCollection(Restaurant, state.restaurants, "restaurantId"),
    replaceCollection(MenuItem, menuItems, "itemId"),
    replaceCollection(Order, state.orders, "orderId"),
    replaceCollection(Reservation, state.reservations, "reservationId"),
    replaceCollection(Review, state.reviews, "reviewId"),
    replaceCollection(Post, state.posts, "postId"),
    replaceCollection(Offer, state.offers, "id"),
    replaceCollection(UserPreference, state.userPreferences, "id"),
    replaceCollection(OrderStatusTracking, state.orderStatusTracking, "id"),
    replaceCollection(Notification, state.notifications, "id"),
  ]);
}

module.exports = {
  isDatabaseReady,
  loadStateFromDatabase,
  persistState,
};
