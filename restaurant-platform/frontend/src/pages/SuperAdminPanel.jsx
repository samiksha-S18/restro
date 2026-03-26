import { useNavigate } from "react-router-dom";
import { useApp } from "../context/appContextShared";

function SuperAdminPanel() {
  const {
    superAdminDashboard,
    superAdminUpdateRestaurantStatus,
    superAdminToggleUserStatus,
    superAdminUpdateReviewStatus,
    superAdminUpdatePostStatus,
    logout,
  } = useApp();
  const navigate = useNavigate();
  const { overview, restaurants, users, orders, reviews, posts, actions } = superAdminDashboard;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <main id="top" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Super Admin</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Platform Operations Dashboard</h1>
            <p className="mt-3 text-sm text-slate-600">Monitor users, restaurants, and platform orders with controlled access.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
          >
            Log Out
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500">Total Users</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{overview.totalUsers}</p>
        </article>
        <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500">Total Restaurants</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{overview.totalRestaurants}</p>
        </article>
        <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500">Total Orders</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{overview.totalOrders}</p>
        </article>
        <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500">Total Revenue</p>
          <p className="mt-3 text-3xl font-black text-slate-900">INR {overview.totalRevenue}</p>
        </article>
        <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500">Total Reviews</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{overview.totalReviews}</p>
        </article>
        <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500">Total Posts</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{overview.totalPosts}</p>
        </article>
      </section>

      <section id="restaurants" className="mt-6 rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Restaurant Management</p>
        <div className="mt-4 space-y-4">
          {restaurants.map((restaurant) => (
            <article key={restaurant.restaurantId} className="rounded-[1.5rem] bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{restaurant.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{restaurant.cuisine} | {restaurant.location}</p>
                  <p className="mt-1 text-sm text-slate-500">Restaurant Admin: {restaurant.adminUser?.name || "Unassigned"}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-violet-700">{restaurant.status}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => superAdminUpdateRestaurantStatus(restaurant.restaurantId, "approved")} className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white">Approve</button>
                <button type="button" onClick={() => superAdminUpdateRestaurantStatus(restaurant.restaurantId, "blocked")} className="rounded-full bg-rose-500 px-4 py-2 text-xs font-bold text-white">Block</button>
                <button type="button" onClick={() => superAdminUpdateRestaurantStatus(restaurant.restaurantId, "suspended")} className="rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-white">Suspend</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div id="orders" className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Order Monitoring</p>
          <div className="mt-4 space-y-4">
            {orders.map((order) => (
              <article key={order.orderId} className="rounded-[1.5rem] bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{order.orderId}</p>
                    <p className="mt-1 text-sm text-slate-600">{order.restaurantName}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-violet-700">{order.status}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{order.userDetails?.name} | INR {order.total}</p>
              </article>
            ))}
          </div>
        </div>

        <div id="users" className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">User Management</p>
          <div className="mt-4 space-y-4">
            {users.map((user) => (
              <article key={user.id} className="rounded-[1.5rem] bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{user.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${user.isBlocked ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => superAdminToggleUserStatus(user.id, "block")} className="rounded-full bg-rose-500 px-4 py-2 text-xs font-bold text-white">Block</button>
                  <button type="button" onClick={() => superAdminToggleUserStatus(user.id, "unblock")} className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white">Unblock</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Review Moderation</p>
          <div className="mt-4 space-y-4">
            {reviews.length ? reviews.filter((review) => review.status !== "deleted").map((review) => (
              <article key={review.reviewId} className="rounded-[1.5rem] bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{review.userName}</p>
                    <p className="mt-1 text-sm text-slate-600">{review.restaurantId} | Rating {review.rating}/5</p>
                  </div>
                  <button type="button" onClick={() => superAdminUpdateReviewStatus(review.reviewId, "deleted")} className="rounded-full bg-rose-500 px-4 py-2 text-xs font-bold text-white">Remove</button>
                </div>
                <p className="mt-3 text-sm text-slate-600">{review.comment}</p>
              </article>
            )) : <p className="text-sm text-slate-500">No reviews to moderate.</p>}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Post Moderation</p>
          <div className="mt-4 space-y-4">
            {posts.length ? posts.filter((post) => post.status !== "deleted").map((post) => (
              <article key={post.postId} className="rounded-[1.5rem] bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{post.userName}</p>
                    <p className="mt-1 text-sm text-slate-600">{post.restaurantName} | {post.mediaType}</p>
                  </div>
                  <button type="button" onClick={() => superAdminUpdatePostStatus(post.postId, "deleted")} className="rounded-full bg-rose-500 px-4 py-2 text-xs font-bold text-white">Remove</button>
                </div>
                <p className="mt-3 text-sm text-slate-600">{post.caption}</p>
                <a href={post.mediaUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-violet-600">Open media</a>
              </article>
            )) : <p className="text-sm text-slate-500">No posts to moderate.</p>}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Recent Actions</p>
        <div className="mt-4 space-y-4">
          {actions.length ? actions.map((action) => (
            <article key={action.id} className="rounded-[1.5rem] bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-bold text-slate-900">{action.actorName}</p>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-violet-700">{action.resource}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{action.action}</p>
              <p className="mt-1 text-xs text-slate-500">{new Date(action.createdAt).toLocaleString()}</p>
            </article>
          )) : <p className="text-sm text-slate-500">No recent actions recorded.</p>}
        </div>
      </section>
    </main>
  );
}

export default SuperAdminPanel;
