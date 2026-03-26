function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not allowed to access this resource." });
    }
    return next();
  };
}

const requireSuperAdmin = requireRole("super_admin");
const requireRestaurantAdmin = requireRole("restaurant_admin");
const requireAdmin = requireRole("super_admin", "restaurant_admin");

module.exports = {
  requireAdmin,
  requireRole,
  requireSuperAdmin,
  requireRestaurantAdmin,
};
