import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { AppContext } from "./appContextShared";

const API = "/api";

function getStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function createLocalId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function dedupeById(items, key = "id") {
  const seen = new Set();
  return items.filter((item) => {
    const value = item?.[key];
    if (!value || seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

export function AppProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("food-token") || "");
  const [user, setUser] = useState(() => getStored("food-user", null));
  const [restaurants, setRestaurants] = useState([]);
  const [cart, setCart] = useState(() => getStored("food-cart", []));
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [offers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [popupNotifications, setPopupNotifications] = useState([]);
  const [superAdminDashboard, setSuperAdminDashboard] = useState({
    overview: {
      totalUsers: 0,
      totalRestaurants: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalReviews: 0,
      totalPosts: 0,
    },
    restaurants: [],
    users: [],
    orders: [],
    reviews: [],
    posts: [],
    actions: [],
  });
  const [restaurantAdminDashboard, setRestaurantAdminDashboard] = useState({
    restaurant: null,
    orders: [],
    reservations: [],
    reviews: [],
    posts: [],
  });
  const [recommendations, setRecommendations] = useState([]);
  const [checkoutDraft, setCheckoutDraft] = useState({
    address: "Home - 42 Lavelle Road, Bengaluru",
    paymentMethod: "UPI",
    orderNote: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allergyWarning, setAllergyWarning] = useState(null);

  useEffect(() => {
    localStorage.setItem("food-cart", JSON.stringify(cart));
  }, [cart]);

  async function api(path, options = {}, authToken = token) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(options.headers || {}),
      },
    });
    const text = await response.text();
    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      if (!response.ok) {
        throw new Error(
          text.trim().startsWith("<")
            ? "Backend API is not responding correctly. Please restart the backend server."
            : "Server returned an unexpected response."
        );
      }
      throw new Error("Server returned an unexpected response.");
    }

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  const normalizedOffers = useMemo(() => {
    if (offers.length) {
      return offers;
    }

    return restaurants.slice(0, 3).map((restaurant, index) => ({
      id: restaurant.id,
      title: index === 0 ? "Flat 40% OFF" : index === 1 ? "Buy 1 Get 1" : "Free Dessert",
      description: restaurant.name,
      restaurantId: restaurant.id,
      isActive: true,
    }));
  }, [offers, restaurants]);

  async function refreshRestaurants() {
    const data = await api("/restaurants", { headers: {} });
    setRestaurants(data);
    setReviews(data.flatMap((restaurant) => restaurant.reviews || []));
    return data;
  }

  async function refreshNotifications(activeToken = token, markPopups = true) {
    if (!activeToken) {
      setNotifications([]);
      return [];
    }

    const data = await api("/profile/notifications", {}, activeToken);
    const nextNotifications = data.notifications || [];
    setNotifications(nextNotifications);

    if (markPopups) {
      setPopupNotifications((current) =>
        dedupeById(
          [...current, ...nextNotifications.filter((item) => !item.isRead)],
          "id"
        )
      );
    }

    return nextNotifications;
  }

  async function refreshProfile(activeToken = token) {
    if (!activeToken) {
      setUser(null);
      setOrders([]);
      setActiveOrders([]);
      setBookings([]);
      setCart([]);
      return;
    }

    const [profileData, cartData, activeOrderData] = await Promise.all([
      api("/profile", {}, activeToken),
      api("/cart", {}, activeToken),
      api("/cart/orders/active", {}, activeToken),
    ]);

    const nextUser = profileData.user;
    setUser(nextUser);
    setOrders(nextUser.orderHistory || []);
    setBookings(nextUser.bookings || []);
    setCart(nextUser.role === "user" ? cartData.items || [] : []);
    setActiveOrders(nextUser.role === "user" ? activeOrderData.orders || [] : []);
    localStorage.setItem("food-user", JSON.stringify(nextUser));
    return nextUser;
  }

  async function refreshSuperAdminDashboard(activeToken = token) {
    if (!activeToken) {
      setSuperAdminDashboard({
        overview: { totalUsers: 0, totalRestaurants: 0, totalOrders: 0, totalRevenue: 0, totalReviews: 0, totalPosts: 0 },
        restaurants: [],
        users: [],
        orders: [],
        reviews: [],
        posts: [],
        actions: [],
      });
      return null;
    }

    const data = await api("/super-admin/dashboard", {}, activeToken);
    setSuperAdminDashboard(data);
    return data;
  }

  async function refreshRestaurantAdminDashboard(activeToken = token) {
    if (!activeToken) {
      setRestaurantAdminDashboard({
        restaurant: null,
        orders: [],
        reservations: [],
        reviews: [],
        posts: [],
      });
      return null;
    }

    const data = await api("/restaurant-admin/dashboard", {}, activeToken);
    setRestaurantAdminDashboard(data);
    return data;
  }

  const bootstrapSession = useEffectEvent(async (activeToken, ignoreRef) => {
    setLoading(true);
    try {
      await refreshRestaurants();

      if (activeToken) {
        const nextUser = await refreshProfile(activeToken);
        await refreshNotifications(activeToken, true);

        if (nextUser?.role === "super_admin") {
          await refreshSuperAdminDashboard(activeToken);
        } else if (nextUser?.role === "restaurant_admin") {
          await refreshRestaurantAdminDashboard(activeToken);
        }
      }

      if (!ignoreRef.current) {
        setError("");
      }
    } catch (err) {
      if (!ignoreRef.current) {
        setError(err.message);
      }
    } finally {
      if (!ignoreRef.current) {
        setLoading(false);
      }
    }
  });

  const pollRoleData = useEffectEvent(async (activeToken) => {
    await refreshNotifications(activeToken, true);
    const nextUser = await refreshProfile(activeToken);

    if (nextUser?.role === "super_admin") {
      await refreshSuperAdminDashboard(activeToken);
    } else if (nextUser?.role === "restaurant_admin") {
      await refreshRestaurantAdminDashboard(activeToken);
    }
  });

  const pollRestaurants = useEffectEvent(async () => {
    await refreshRestaurants();
  });

  // Bootstrap the correct dashboard and profile data for the current role.
  useEffect(() => {
    const ignoreRef = { current: false };
    bootstrapSession(token, ignoreRef);

    return () => {
      ignoreRef.current = true;
    };
  }, [token]);

  // Poll role-specific data so each dashboard stays current without mixing scopes.
  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      pollRoleData(token).catch(() => {});
    }, 10000);

    return () => window.clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      pollRestaurants().catch(() => {});
    }, 8000);

    return () => window.clearInterval(interval);
  }, []);

  function saveAuth(nextToken, nextUser) {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem("food-token", nextToken);
    localStorage.setItem("food-user", JSON.stringify(nextUser));
  }

  async function login(form) {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
    });

    saveAuth(data.token, data.user);
    await Promise.all([refreshProfile(data.token), refreshNotifications(data.token, true)]);

    if (data.user.role === "super_admin") {
      await refreshSuperAdminDashboard(data.token);
    } else if (data.user.role === "restaurant_admin") {
      await refreshRestaurantAdminDashboard(data.token);
    }

    return data;
  }

  async function signup(form) {
    const data = await api("/auth/signup", {
      method: "POST",
      body: JSON.stringify(form),
    });
    saveAuth(data.token, data.user);
    await Promise.all([refreshProfile(data.token), refreshNotifications(data.token, true)]);
    return data;
  }

  function logout() {
    setToken("");
    setUser(null);
    setOrders([]);
    setActiveOrders([]);
    setBookings([]);
    setNotifications([]);
    setCart([]);
    setSuperAdminDashboard({
      overview: { totalUsers: 0, totalRestaurants: 0, totalOrders: 0, totalRevenue: 0, totalReviews: 0, totalPosts: 0 },
      restaurants: [],
      users: [],
      orders: [],
      reviews: [],
      posts: [],
      actions: [],
    });
    setRestaurantAdminDashboard({
      restaurant: null,
      orders: [],
      reservations: [],
      reviews: [],
      posts: [],
    });
    localStorage.removeItem("food-token");
    localStorage.removeItem("food-user");
  }

  async function updateAllergies(allergies) {
    const data = await api("/profile/allergies", {
      method: "PUT",
      body: JSON.stringify({ allergies }),
    });
    setUser((current) => ({ ...current, allergies: data.allergies }));
    return data;
  }

  async function updateSettings(settings) {
    const data = await api("/profile/settings", {
      method: "PUT",
      body: JSON.stringify({ settings }),
    });
    setUser((current) => ({ ...current, settings: data.settings }));
    return data;
  }

  async function addToCart(restaurantId, item) {
    const conflicts = (user?.allergies || []).filter((allergy) => item.allergens.includes(allergy));
    if (conflicts.length) {
      setAllergyWarning({ itemName: item.name, allergens: conflicts });
    }

    if (!user) {
      let nextItems = [];
      setCart((current) => {
        const existing = current.find((entry) => entry.itemId === item.itemId || entry.itemId === item.id);
        if (existing) {
          nextItems = current.map((entry) =>
            entry.itemId === existing.itemId ? { ...entry, quantity: entry.quantity + 1 } : entry
          );
          return nextItems;
        }

        nextItems = [
          ...current,
          {
            id: createLocalId("cart"),
            itemId: item.itemId || item.id,
            restaurantId,
            restaurantName:
              restaurants.find((restaurant) => restaurant.id === restaurantId)?.name || "Restaurant",
            name: item.name,
            price: item.price,
            type: item.type,
            quantity: 1,
          },
        ];
        return nextItems;
      });
      return { items: nextItems };
    }

    const data = await api("/cart", {
      method: "POST",
      body: JSON.stringify({ restaurantId, itemId: item.itemId || item.id, quantity: 1 }),
    });
    setCart(data.items);
    return data;
  }

  async function updateCartItem(itemId, quantity) {
    if (!user) {
      setCart((current) => {
        if (quantity <= 0) {
          return current.filter((entry) => entry.id !== itemId && entry.itemId !== itemId);
        }
        return current.map((entry) =>
          entry.id === itemId || entry.itemId === itemId ? { ...entry, quantity } : entry
        );
      });
      return null;
    }

    if (quantity <= 0) {
      const data = await api(`/cart/${itemId}`, { method: "DELETE" });
      setCart(data.items);
      return data;
    }

    const data = await api(`/cart/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
    setCart(data.items);
    return data;
  }

  async function checkoutCart(payload) {
    const data = await api("/cart/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setOrders((current) => [data.order, ...current]);
    setCart([]);
    return data;
  }

  async function addReview(restaurantId, review) {
    await api(`/restaurants/${restaurantId}/reviews`, {
      method: "POST",
      body: JSON.stringify(review),
    });
    await refreshRestaurants();
    await refreshProfile();
  }

  async function createPost(payload) {
    const data = await api("/posts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await Promise.all([
      refreshRestaurants(),
      refreshProfile(),
      user?.role === "super_admin" ? refreshSuperAdminDashboard() : Promise.resolve(),
      user?.role === "restaurant_admin" ? refreshRestaurantAdminDashboard() : Promise.resolve(),
    ]);
    return data;
  }

  async function createBooking(restaurantId, booking) {
    const data = await api(`/restaurants/${restaurantId}/bookings`, {
      method: "POST",
      body: JSON.stringify(booking),
    });
    setBookings((current) => [data.booking, ...current]);
    return data;
  }

  async function requestRecommendations(mood) {
    const data = await api("/profile/recommendations", {
      method: "POST",
      body: JSON.stringify({ mood }),
    });
    setRecommendations(data.recommendations || []);
    await refreshProfile();
    return data;
  }

  async function markNotificationRead(notificationId) {
    await api(`/profile/notifications/${notificationId}/read`, { method: "PATCH" });
    setNotifications((current) =>
      current.map((item) => (item.id === notificationId ? { ...item, isRead: true } : item))
    );
  }

  function dismissPopup(notificationId) {
    setPopupNotifications((current) => current.filter((item) => item.id !== notificationId));
    markNotificationRead(notificationId).catch(() => {});
  }

  async function reviewAfterAdminAction(action) {
    const result = await action;
    await Promise.all([
      refreshRestaurants(),
      refreshNotifications(),
      refreshProfile(),
      user?.role === "super_admin" ? refreshSuperAdminDashboard() : Promise.resolve(),
      user?.role === "restaurant_admin" ? refreshRestaurantAdminDashboard() : Promise.resolve(),
    ]);
    return result;
  }

  async function superAdminUpdateRestaurantStatus(restaurantId, status) {
    return reviewAfterAdminAction(
      api(`/super-admin/restaurants/${restaurantId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
    );
  }

  async function superAdminToggleUserStatus(userId, action) {
    return reviewAfterAdminAction(
      api(`/super-admin/users/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      })
    );
  }

  async function restaurantAddMenuItem(payload) {
    return reviewAfterAdminAction(
      api("/restaurant-admin/menu-items", {
        method: "POST",
        body: JSON.stringify(payload),
      })
    );
  }

  async function restaurantUpdateMenuItem(itemId, payload) {
    return reviewAfterAdminAction(
      api(`/restaurant-admin/menu-items/${itemId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })
    );
  }

  async function restaurantDeleteMenuItem(itemId) {
    return reviewAfterAdminAction(
      api(`/restaurant-admin/menu-items/${itemId}`, {
        method: "DELETE",
      })
    );
  }

  async function restaurantDecideOrder(orderId, decision) {
    return reviewAfterAdminAction(
      api(`/restaurant-admin/orders/${orderId}/decision`, {
        method: "PATCH",
        body: JSON.stringify({ decision }),
      })
    );
  }

  async function restaurantDeliverOrder(orderId) {
    return reviewAfterAdminAction(
      api(`/restaurant-admin/orders/${orderId}/deliver`, {
        method: "PATCH",
      })
    );
  }

  async function restaurantDecideReservation(reservationId, decision) {
    return reviewAfterAdminAction(
      api(`/restaurant-admin/reservations/${reservationId}/decision`, {
        method: "PATCH",
        body: JSON.stringify({ decision }),
      })
    );
  }

  async function restaurantUpdateReviewStatus(reviewId, status) {
    return reviewAfterAdminAction(
      api(`/restaurant-admin/reviews/${reviewId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
    );
  }

  async function restaurantUpdatePostStatus(postId, status) {
    return reviewAfterAdminAction(
      api(`/restaurant-admin/posts/${postId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
    );
  }

  async function superAdminUpdateReviewStatus(reviewId, status) {
    return reviewAfterAdminAction(
      api(`/super-admin/reviews/${reviewId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
    );
  }

  async function superAdminUpdatePostStatus(postId, status) {
    return reviewAfterAdminAction(
      api(`/super-admin/posts/${postId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
    );
  }

  return (
    <AppContext.Provider
      value={{
        restaurants,
        user,
        cart,
        bookings,
        orders,
        activeOrders,
        offers: normalizedOffers,
        reviews,
        notifications,
        popupNotifications,
        superAdminDashboard,
        restaurantAdminDashboard,
        recommendations,
        checkoutDraft,
        setCheckoutDraft,
        loading,
        error,
        allergyWarning,
        setAllergyWarning,
        login,
        signup,
        logout,
        updateAllergies,
        updateSettings,
        addToCart,
        updateCartItem,
        checkoutCart,
        addReview,
        createPost,
        createBooking,
        requestRecommendations,
        dismissPopup,
        markNotificationRead,
        refreshSuperAdminDashboard,
        refreshRestaurantAdminDashboard,
        superAdminUpdateRestaurantStatus,
        superAdminToggleUserStatus,
        restaurantAddMenuItem,
        restaurantUpdateMenuItem,
        restaurantDeleteMenuItem,
        restaurantDecideOrder,
        restaurantDeliverOrder,
        restaurantDecideReservation,
        restaurantUpdateReviewStatus,
        restaurantUpdatePostStatus,
        superAdminUpdateReviewStatus,
        superAdminUpdatePostStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
