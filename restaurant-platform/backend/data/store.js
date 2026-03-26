const state = {
  nextId: 100,
  users: [
    {
      id: "super-admin-demo",
      role: "super_admin",
      name: "Samiksha",
      email: "demo@foodconnect.app",
      password: "demo123",
      isAdmin: true,
      avatar: "S",
      allergies: ["Dairy"],
      settings: {
        notifications: true,
        darkMode: false,
      },
      postHistory: [
        {
          id: "post-1",
          postId: "post-1",
          restaurantId: "fire-crust",
          restaurantName: "FireCrust Pizza Lab",
          caption: "Late-night pizza mood with extra cheese pull.",
          mediaUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",
          mediaType: "image",
          taggedUsers: ["@rhea"],
          status: "kept",
          createdAt: "2026-03-22T19:30:00.000Z",
        },
      ],
      orderHistory: [
        {
          id: "order-1",
          orderId: "order-1",
          userId: "super-admin-demo",
          restaurantId: "spice-route",
          restaurantName: "Spice Route Kitchen",
          total: 638,
          orderNote: "Please make it mild.",
          status: "Delivered",
          approvalStatus: "accepted",
          tracking: ["Preparing", "Out for Delivery", "Delivered"],
          placedAt: "2026-03-21T18:30:00.000Z",
          items: [
            { itemId: "butter-paneer", name: "Butter Paneer Bowl", quantity: 1, price: 289 },
            { itemId: "garlic-naan", name: "Garlic Naan Basket", quantity: 1, price: 129 },
          ],
          userDetails: {
            userId: "super-admin-demo",
            name: "Samiksha",
            email: "demo@foodconnect.app",
          },
        },
      ],
      reservations: [],
      reviewHistory: [],
    },
    {
      id: "restaurant-admin-spice",
      role: "restaurant_admin",
      restaurantId: "spice-route",
      name: "Spice Route Admin",
      email: "spice@foodconnect.app",
      password: "demo123",
      isAdmin: false,
      avatar: "R",
      allergies: [],
      settings: {
        notifications: true,
        darkMode: false,
      },
      postHistory: [],
      orderHistory: [],
      reservations: [],
      reviewHistory: [],
    },
    {
      id: "restaurant-admin-green",
      role: "restaurant_admin",
      restaurantId: "green-fork",
      name: "Green Fork Admin",
      email: "green@foodconnect.app",
      password: "demo123",
      isAdmin: false,
      avatar: "G",
      allergies: [],
      settings: {
        notifications: true,
        darkMode: false,
      },
      postHistory: [],
      orderHistory: [],
      reservations: [],
      reviewHistory: [],
    },
    {
      id: "restaurant-admin-fire",
      role: "restaurant_admin",
      restaurantId: "fire-crust",
      name: "FireCrust Admin",
      email: "fire@foodconnect.app",
      password: "demo123",
      isAdmin: false,
      avatar: "F",
      allergies: [],
      settings: {
        notifications: true,
        darkMode: false,
      },
      postHistory: [],
      orderHistory: [],
      reservations: [],
      reviewHistory: [],
    },
    {
      id: "user-member",
      role: "user",
      name: "Aarav",
      email: "user@foodconnect.app",
      password: "demo123",
      isAdmin: false,
      avatar: "A",
      allergies: [],
      settings: {
        notifications: true,
        darkMode: false,
      },
      postHistory: [],
      orderHistory: [],
      reservations: [],
      reviewHistory: [],
    },
  ],
  sessions: {
    "seed-demo-token": "user-demo",
  },
  carts: {
    "super-admin-demo": [],
    "restaurant-admin-spice": [],
    "restaurant-admin-green": [],
    "restaurant-admin-fire": [],
    "user-member": [],
  },
  adminRequests: [],
  notifications: [
    {
      id: "notification-1",
      userId: "super-admin-demo",
      type: "order",
      title: "Order delivered",
      message: "Your order from Spice Route Kitchen has been delivered.",
      relatedId: "order-1",
      isRead: false,
      createdAt: "2026-03-21T19:15:00.000Z",
    },
  ],
  offers: [
    {
      id: "offer-1",
      title: "Midweek Comfort Bowl",
      description: "Get 15% off on bowls above INR 299.",
      restaurantId: "spice-route",
      code: "BOWL15",
      isActive: true,
      createdAt: "2026-03-22T09:00:00.000Z",
      updatedAt: "2026-03-22T09:00:00.000Z",
    },
  ],
  posts: [
    {
      id: "post-1",
      postId: "post-1",
      userId: "super-admin-demo",
      userName: "Samiksha",
      restaurantId: "fire-crust",
      restaurantName: "FireCrust Pizza Lab",
      caption: "Late-night pizza mood with extra cheese pull.",
      mediaUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",
      mediaType: "image",
      taggedUsers: ["@rhea"],
      status: "kept",
      createdAt: "2026-03-22T19:30:00.000Z",
    },
    {
      id: "post-2",
      postId: "post-2",
      userId: "super-admin-demo",
      userName: "Samiksha",
      restaurantId: "green-fork",
      restaurantName: "Green Fork Studio",
      caption: "Healthy lunch drop for the day.",
      mediaUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
      mediaType: "video",
      taggedUsers: ["@fitfoodie"],
      status: "kept",
      createdAt: "2026-03-23T11:10:00.000Z",
    },
  ],
  reviews: [],
  orders: [],
  reservations: [],
  orderStatusTracking: [],
  userPreferences: [],
  restaurants: [
    {
      id: "spice-route",
      restaurantId: "spice-route",
      name: "Spice Route Kitchen",
      cuisine: "North Indian, Biryani",
      rating: 4.8,
      deliveryTime: "22-28 min",
      priceForTwo: 650,
      distance: "2.1 km",
      badge: "Top Rated",
      location: "Indiranagar",
      status: "approved",
      accent: "from-violet-500 via-fuchsia-500 to-rose-500",
      coverImage: "https://images.unsplash.com/photo-1604908554165-58e31d89c0f5?auto=format&fit=crop&w=900&q=80",
      media: [
        { id: "m1", type: "image", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80", caption: "Dining room glow-up" },
        { id: "m2", type: "video", url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80", caption: "Chef toss reel" },
      ],
      menu: [
        { id: "butter-paneer", itemId: "butter-paneer", name: "Butter Paneer Bowl", price: 289, type: "veg", allergens: ["Dairy"], rating: 4.7, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80", description: "Creamy tomato gravy with soft paneer cubes." },
        { id: "dum-biryani", itemId: "dum-biryani", name: "Dum Biryani Feast", price: 349, type: "non-veg", allergens: [], rating: 4.9, image: "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?auto=format&fit=crop&w=600&q=80", description: "Slow-cooked biryani layered with spice and aroma." },
        { id: "garlic-naan", itemId: "garlic-naan", name: "Garlic Naan Basket", price: 129, type: "veg", allergens: ["Gluten"], rating: 4.5, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80", description: "Buttery naan brushed with garlic and herbs." },
      ],
      reviews: [
        { id: "review-1", reviewId: "review-1", userId: "user-member", userName: "Aarav", rating: 5, comment: "Perfect comfort food and very fast delivery.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80", itemId: "dum-biryani", restaurantId: "spice-route", status: "visible", createdAt: "2026-03-20T10:15:00.000Z" },
      ],
      managedBy: "restaurant-admin-spice",
    },
    {
      id: "green-fork",
      restaurantId: "green-fork",
      name: "Green Fork Studio",
      cuisine: "Healthy, Salads, Wraps",
      rating: 4.7,
      deliveryTime: "18-24 min",
      priceForTwo: 540,
      distance: "1.4 km",
      badge: "Healthy Choice",
      location: "Koramangala",
      status: "approved",
      accent: "from-violet-400 via-purple-500 to-indigo-500",
      coverImage: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
      media: [
        { id: "m3", type: "image", url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80", caption: "Colorful bowl drop" },
        { id: "m4", type: "video", url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80", caption: "Healthy prep story" },
      ],
      menu: [
        { id: "quinoa-bowl", itemId: "quinoa-bowl", name: "Quinoa Crunch Bowl", price: 259, type: "veg", allergens: ["Soy"], rating: 4.6, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80", description: "Protein-packed bowl with greens and roasted seeds." },
        { id: "avocado-wrap", itemId: "avocado-wrap", name: "Avocado Wrap", price: 229, type: "veg", allergens: ["Gluten"], rating: 4.4, image: "https://images.unsplash.com/photo-1628191010210-a59de33e5941?auto=format&fit=crop&w=600&q=80", description: "Fresh avocado wrap with crunchy greens." },
        { id: "green-juice", itemId: "green-juice", name: "Green Glow Juice", price: 149, type: "veg", allergens: [], rating: 4.5, image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=600&q=80", description: "Cold-pressed juice with mint and citrus." },
      ],
      reviews: [
        { id: "review-2", reviewId: "review-2", userId: "super-admin-demo", userName: "Nisha", rating: 4, comment: "Loved the freshness and clean flavors.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80", itemId: "quinoa-bowl", restaurantId: "green-fork", status: "visible", createdAt: "2026-03-19T13:10:00.000Z" },
      ],
      managedBy: "restaurant-admin-green",
    },
    {
      id: "fire-crust",
      restaurantId: "fire-crust",
      managedBy: "restaurant-admin-fire",
      name: "FireCrust Pizza Lab",
      cuisine: "Pizza, Italian",
      rating: 4.9,
      deliveryTime: "25-30 min",
      priceForTwo: 780,
      distance: "3.2 km",
      badge: "Late Night Hot",
      location: "HSR Layout",
      status: "approved",
      accent: "from-purple-600 via-violet-500 to-pink-500",
      coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",
      media: [
        { id: "m5", type: "image", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80", caption: "Cheese pull hero shot" },
        { id: "m6", type: "video", url: "https://images.unsplash.com/photo-1520201163981-8cc95007dd2e?auto=format&fit=crop&w=900&q=80", caption: "Oven-fresh reel" },
      ],
      menu: [
        { id: "truffle-pizza", itemId: "truffle-pizza", name: "Truffle Mushroom Pizza", price: 399, type: "veg", allergens: ["Dairy", "Gluten"], rating: 4.8, image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=80", description: "Earthy mushrooms and truffle cream on a crisp base." },
        { id: "pepperoni-pizza", itemId: "pepperoni-pizza", name: "Smoked Pepperoni Pizza", price: 429, type: "non-veg", allergens: ["Dairy", "Gluten"], rating: 4.9, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80", description: "Bold pepperoni, mozzarella, and house sauce." },
        { id: "tiramisu", itemId: "tiramisu", name: "Mini Tiramisu", price: 179, type: "veg", allergens: ["Dairy", "Egg", "Gluten"], rating: 4.7, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80", description: "Coffee-soaked dessert with creamy mascarpone layers." },
      ],
      reviews: [
        { id: "review-3", reviewId: "review-3", userId: "super-admin-demo", userName: "Rhea", rating: 5, comment: "Best pizza night pick in the area.", image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=500&q=80", itemId: "truffle-pizza", restaurantId: "fire-crust", status: "visible", createdAt: "2026-03-18T20:45:00.000Z" },
      ],
    },
  ],
};

const demoUsers = [
  {
    id: "super-admin-demo",
    role: "super_admin",
    restaurantId: null,
    name: "Samiksha",
    email: "demo@foodconnect.app",
    password: "demo123",
    avatar: "S",
  },
  {
    id: "restaurant-admin-spice",
    role: "restaurant_admin",
    restaurantId: "spice-route",
    name: "Spice Route Admin",
    email: "spice@foodconnect.app",
    password: "demo123",
    avatar: "R",
  },
  {
    id: "restaurant-admin-green",
    role: "restaurant_admin",
    restaurantId: "green-fork",
    name: "Green Fork Admin",
    email: "green@foodconnect.app",
    password: "demo123",
    avatar: "G",
  },
  {
    id: "restaurant-admin-fire",
    role: "restaurant_admin",
    restaurantId: "fire-crust",
    name: "FireCrust Admin",
    email: "fire@foodconnect.app",
    password: "demo123",
    avatar: "F",
  },
];

function visitStateIds(value, visitor, seen = new Set()) {
  if (!value || typeof value !== "object") {
    return;
  }

  if (seen.has(value)) {
    return;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((item) => visitStateIds(item, visitor, seen));
    return;
  }

  ["id", "userId", "restaurantId", "itemId", "reviewId", "postId", "orderId", "reservationId"].forEach((key) => {
    if (typeof value[key] === "string") {
      visitor(value[key]);
    }
  });

  Object.values(value).forEach((item) => visitStateIds(item, visitor, seen));
}

function createId(prefix) {
  state.nextId += 1;
  return `${prefix}-${state.nextId}`;
}

function getUserById(userId) {
  return state.users.find((user) => user.id === userId);
}

function getPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || (user.isAdmin ? "super_admin" : "user"),
    isAdmin: ["super_admin", "restaurant_admin"].includes(user.role),
    isSuperAdmin: user.role === "super_admin",
    isRestaurantAdmin: user.role === "restaurant_admin",
    restaurantId: user.restaurantId || null,
    isBlocked: Boolean(user.isBlocked),
    avatar: user.avatar,
    allergies: user.allergies || [],
    settings: user.settings || { notifications: true, darkMode: false },
  };
}

function ensureUserCollections(user) {
  if (!Array.isArray(user.postHistory)) {
    user.postHistory = [];
  }
  if (!Array.isArray(user.orderHistory)) {
    user.orderHistory = [];
  }
  if (!Array.isArray(user.reservations)) {
    user.reservations = [];
  }
  if (!Array.isArray(user.reviewHistory)) {
    user.reviewHistory = [];
  }
}

function createTrackingPoint(status, orderId) {
  const map = {
    Pending: { x: 10, y: 80, label: "Queued" },
    Accepted: { x: 22, y: 68, label: "Accepted" },
    Preparing: { x: 40, y: 56, label: "Kitchen" },
    "Out for Delivery": { x: 68, y: 35, label: "Rider" },
    Delivered: { x: 88, y: 18, label: "Delivered" },
    Cancelled: { x: 15, y: 20, label: "Cancelled" },
    Declined: { x: 15, y: 20, label: "Declined" },
  };

  return {
    id: createId("tracking"),
    orderId,
    status,
    coordinates: map[status] || { x: 10, y: 80, label: status },
    updatedAt: new Date().toISOString(),
  };
}

function normalizeState() {
  demoUsers.forEach((demoUser) => {
    const exists = state.users.some((user) => user.email.toLowerCase() === demoUser.email.toLowerCase());
    if (!exists) {
      state.users.push({
        ...demoUser,
        isAdmin: demoUser.role !== "user",
        isBlocked: false,
        allergies: [],
        settings: {
          notifications: true,
          darkMode: false,
        },
        postHistory: [],
        orderHistory: [],
        reservations: [],
        reviewHistory: [],
      });
    }
  });

  const defaultRestaurantAdmin =
    state.users.find((user) => user.role === "restaurant_admin") || null;

  state.restaurants.forEach((restaurant) => {
    restaurant.id = restaurant.id || restaurant.restaurantId;
    restaurant.restaurantId = restaurant.restaurantId || restaurant.id;
    restaurant.status = restaurant.status || "approved";
    restaurant.managedBy = restaurant.managedBy || defaultRestaurantAdmin?.id || null;
    restaurant.menu = (restaurant.menu || []).map((item) => ({
      ...item,
      id: item.id || item.itemId,
      itemId: item.itemId || item.id,
    }));
    restaurant.reviews = (restaurant.reviews || [])
      .filter((review) => review.status !== "deleted")
      .map((review) => ({
        ...review,
        id: review.id || review.reviewId,
        reviewId: review.reviewId || review.id,
        restaurantId: review.restaurantId || restaurant.id,
        status: review.status || "visible",
      }));
  });

  state.reviews = state.restaurants.flatMap((restaurant) =>
    (restaurant.reviews || []).map((review) => ({
      ...review,
      id: review.id || review.reviewId,
      restaurantId: restaurant.id,
    }))
  );

  state.users.forEach((user) => {
    if (user.role === "admin") {
      user.role = "super_admin";
    }
    user.role = user.role || (user.isAdmin ? "super_admin" : "user");
    user.isAdmin = user.role !== "user";
    user.isBlocked = Boolean(user.isBlocked);
    user.restaurantId = user.restaurantId || null;
    ensureUserCollections(user);
    if (!Array.isArray(state.carts[user.id])) {
      state.carts[user.id] = [];
    }
  });

  state.restaurants.forEach((restaurant) => {
    const currentOwner = state.users.find(
      (user) => user.id === restaurant.managedBy && user.role === "restaurant_admin"
    );
    const matchedOwner = state.users.find(
      (user) => user.role === "restaurant_admin" && user.restaurantId === restaurant.restaurantId
    );
    const owner = matchedOwner || currentOwner || defaultRestaurantAdmin;

    if (owner) {
      restaurant.managedBy = owner.id;
      owner.restaurantId = restaurant.restaurantId;
    }
  });

  state.users
    .filter((user) => user.role === "restaurant_admin")
    .forEach((user) => {
      const managedRestaurant = state.restaurants.find(
        (restaurant) => restaurant.managedBy === user.id || restaurant.restaurantId === user.restaurantId
      );

      if (managedRestaurant) {
        user.restaurantId = managedRestaurant.restaurantId;
      }
    });

  state.orders = state.users.flatMap((user) =>
    (user.orderHistory || []).map((order) => ({
      ...order,
      id: order.id || order.orderId,
      orderId: order.orderId || order.id,
      userId: order.userId || user.id,
      userDetails: order.userDetails || {
        userId: user.id,
        name: user.name,
        email: user.email,
      },
      approvalStatus: order.approvalStatus || "accepted",
      orderNote: order.orderNote || "",
    }))
  );

  state.orderStatusTracking = state.orders.flatMap((order) => {
    const statuses = order.approvalStatus === "pending"
      ? ["Pending"]
      : ["Accepted", ...(order.tracking || [])];

    return statuses.map((status) => createTrackingPoint(status, order.orderId));
  });

  state.userPreferences = state.users.map((user) => {
    const orderItems = (user.orderHistory || []).flatMap((order) =>
      (order.items || []).map((item) => typeof item === "string" ? item : item.name)
    );

    return {
      id: `pref-${user.id}`,
      userId: user.id,
      theme: user.settings?.darkMode ? "dark" : "light",
      favoriteItems: orderItems,
      frequentlyOrderedItems: orderItems,
      moods: [],
      updatedAt: new Date().toISOString(),
    };
  });

  state.reservations = state.reservations.map((reservation) => ({
    ...reservation,
    id: reservation.id || reservation.reservationId,
    reservationId: reservation.reservationId || reservation.id,
  }));

  state.posts = state.posts.map((post) => ({
    ...post,
    id: post.id || post.postId,
    postId: post.postId || post.id,
  }));
}

function recomputeNextId() {
  let maxId = 100;

  visitStateIds(state, (value) => {
    const match = /-(\d+)$/.exec(value);
    if (match) {
      maxId = Math.max(maxId, Number(match[1]));
    }
  });

  state.nextId = maxId;
}

normalizeState();
recomputeNextId();

module.exports = {
  state,
  createId,
  createTrackingPoint,
  ensureUserCollections,
  getPublicUser,
  getUserById,
  normalizeState,
  recomputeNextId,
};
