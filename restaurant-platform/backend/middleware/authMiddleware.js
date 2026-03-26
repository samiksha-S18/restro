const jwt = require("jsonwebtoken");
const { state } = require("../data/store");

const JWT_SECRET = process.env.JWT_SECRET || "restaurant-platform-dev-secret";

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const user = state.users.find((item) => item.id === payload.userId);
  if (!user) {
    return res.status(401).json({ message: "Invalid session" });
  }

  if (user.isBlocked) {
    return res.status(403).json({ message: "This account has been blocked. Contact support." });
  }

  req.user = user;
  req.token = token;
  return next();
}

module.exports = { requireAuth };
