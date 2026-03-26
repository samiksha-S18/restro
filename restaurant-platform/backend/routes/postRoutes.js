const express = require("express");
const { createId, state } = require("../data/store");
const { requireAuth } = require("../middleware/authMiddleware");
const { logAdminRequest } = require("../utils/adminLog");
const { persistState } = require("../utils/persistence");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ posts: state.posts.filter((post) => post.status !== "deleted") });
});

router.post("/", requireAuth, async (req, res) => {
  const { restaurantId, caption, mediaUrl, mediaType = "image", taggedUsers = [] } = req.body || {};
  const restaurant = state.restaurants.find((item) => item.id === restaurantId);
  const normalizedTags = Array.isArray(taggedUsers)
    ? taggedUsers
    : String(taggedUsers)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  if (!restaurant || !caption || !mediaUrl) {
    return res.status(400).json({ message: "Restaurant, caption, and media URL are required" });
  }

  const post = {
    id: createId("post"),
    userId: req.user.id,
    userName: req.user.name,
    restaurantId,
    restaurantName: restaurant.name,
    caption,
    mediaUrl,
    mediaType,
    taggedUsers: normalizedTags,
    status: "kept",
    createdAt: new Date().toISOString(),
  };
  post.postId = post.id;

  state.posts.unshift(post);
  req.user.postHistory = [post, ...(req.user.postHistory || [])];

  logAdminRequest({
    actorId: req.user.id,
    actorName: req.user.name,
    action: "create",
    resource: "post",
    details: { postId: post.postId, restaurantId, mediaType },
  });

  await persistState();
  return res.status(201).json({ message: "Post created", post });
});

module.exports = router;
