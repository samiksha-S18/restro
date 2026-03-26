import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/appContextShared";

function RestaurantAdminPanel() {
  const {
    restaurantAdminDashboard,
    restaurantAddMenuItem,
    restaurantUpdateMenuItem,
    restaurantDeleteMenuItem,
    restaurantDecideOrder,
    restaurantDeliverOrder,
    restaurantDecideReservation,
    restaurantUpdateReviewStatus,
    restaurantUpdatePostStatus,
    logout,
  } = useApp();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [menuForm, setMenuForm] = useState({ name: "", price: "", type: "veg", description: "", allergens: "" });
  const [editingItemId, setEditingItemId] = useState("");

  const restaurant = restaurantAdminDashboard.restaurant;
  const pendingOrders = useMemo(
    () => restaurantAdminDashboard.orders.filter((order) => order.approvalStatus === "pending").length,
    [restaurantAdminDashboard.orders]
  );
  const pendingReservations = useMemo(
    () => restaurantAdminDashboard.reservations.filter((reservation) => reservation.status === "pending").length,
    [restaurantAdminDashboard.reservations]
  );
  const progressableStatuses = ["Accepted", "Preparing", "Out for Delivery"];

  async function runAction(task, successMessage) {
    try {
      await task();
      setMessage(successMessage);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleMenuSubmit(event) {
    event.preventDefault();
    const payload = {
      ...menuForm,
      price: Number(menuForm.price),
      allergens: menuForm.allergens.split(",").map((item) => item.trim()).filter(Boolean),
    };

    if (editingItemId) {
      await runAction(() => restaurantUpdateMenuItem(editingItemId, payload), "Menu item updated.");
    } else {
      await runAction(() => restaurantAddMenuItem(payload), "Menu item added.");
    }

    setMenuForm({ name: "", price: "", type: "veg", description: "", allergens: "" });
    setEditingItemId("");
  }

  function startEdit(item) {
    setEditingItemId(item.itemId);
    setMenuForm({
      name: item.name,
      price: String(item.price),
      type: item.type,
      description: item.description || "",
      allergens: (item.allergens || []).join(", "),
    });
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (!restaurant) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          Restaurant assignment not found.
        </div>
      </main>
    );
  }

  return (
    <main id="top" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Restaurant Admin</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">{restaurant.name}</h1>
            <p className="mt-3 text-sm text-slate-600">{restaurant.cuisine} | {restaurant.location} | Status: {restaurant.status}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
          >
            Log Out
          </button>
        </div>
        {message ? <p className="mt-4 rounded-2xl bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700">{message}</p> : null}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500">Menu Items</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{restaurant.menu?.length || 0}</p>
        </article>
        <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500">Pending Orders</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{pendingOrders}</p>
        </article>
        <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500">Pending Reservations</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{pendingReservations}</p>
        </article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Review Feed</p>
          <div className="mt-4 space-y-4">
            {restaurantAdminDashboard.reviews.length ? restaurantAdminDashboard.reviews.filter((review) => review.status !== "deleted").map((review) => (
              <article key={review.reviewId} className="rounded-[1.5rem] bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{review.userName}</p>
                    <p className="mt-1 text-sm text-slate-600">Rating {review.rating}/5</p>
                  </div>
                  <button type="button" onClick={() => runAction(() => restaurantUpdateReviewStatus(review.reviewId, "deleted"), "Review removed.")} className="rounded-full bg-rose-500 px-4 py-2 text-xs font-bold text-white">Remove</button>
                </div>
                <p className="mt-3 text-sm text-slate-600">{review.comment}</p>
              </article>
            )) : <p className="text-sm text-slate-500">No reviews yet.</p>}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Photo / Video Posts</p>
          <div className="mt-4 space-y-4">
            {restaurantAdminDashboard.posts.length ? restaurantAdminDashboard.posts.map((post) => (
              <article key={post.postId} className="rounded-[1.5rem] bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{post.userName}</p>
                    <p className="mt-1 text-sm text-slate-600">{post.mediaType}</p>
                  </div>
                  <button type="button" onClick={() => runAction(() => restaurantUpdatePostStatus(post.postId, "deleted"), "Post removed.")} className="rounded-full bg-rose-500 px-4 py-2 text-xs font-bold text-white">Remove</button>
                </div>
                <p className="mt-3 text-sm text-slate-600">{post.caption}</p>
                <a href={post.mediaUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-violet-600">Open media</a>
              </article>
            )) : <p className="text-sm text-slate-500">No customer media posts yet.</p>}
          </div>
        </div>
      </section>

      <section id="menu" className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Manage Menu</p>
          <form onSubmit={handleMenuSubmit} className="mt-4 grid gap-3">
            <input value={menuForm.name} onChange={(event) => setMenuForm((current) => ({ ...current, name: event.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Food item name" />
            <input type="number" value={menuForm.price} onChange={(event) => setMenuForm((current) => ({ ...current, price: event.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Price" />
            <select value={menuForm.type} onChange={(event) => setMenuForm((current) => ({ ...current, type: event.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none">
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
            </select>
            <textarea value={menuForm.description} onChange={(event) => setMenuForm((current) => ({ ...current, description: event.target.value }))} className="h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Description" />
            <input value={menuForm.allergens} onChange={(event) => setMenuForm((current) => ({ ...current, allergens: event.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Allergens, comma separated" />
            <button type="submit" className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">
              {editingItemId ? "Update Food Item" : "Add Food Item"}
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Current Menu</p>
          <div className="mt-4 space-y-4">
            {(restaurant.menu || []).map((item) => (
              <article key={item.itemId} className="rounded-[1.5rem] bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-600">INR {item.price} | {item.type}</p>
                    <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => startEdit(item)} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-700">Edit</button>
                    <button type="button" onClick={() => runAction(() => restaurantDeleteMenuItem(item.itemId), "Menu item deleted.")} className="rounded-full bg-rose-500 px-4 py-2 text-xs font-bold text-white">Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <div id="orders" className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Order Management</p>
          <div className="mt-4 space-y-4">
            {restaurantAdminDashboard.orders.map((order) => (
              <article key={order.orderId} className="rounded-[1.5rem] bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{order.userDetails?.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{order.orderId}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-violet-700">{order.status}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{(order.items || []).map((item) => `${item.name} x${item.quantity}`).join(", ")}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {order.approvalStatus === "pending" ? (
                    <>
                      <button type="button" onClick={() => runAction(() => restaurantDecideOrder(order.orderId, "accepted"), "Order accepted.")} className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white">Accept</button>
                      <button type="button" onClick={() => runAction(() => restaurantDecideOrder(order.orderId, "rejected"), "Order rejected.")} className="rounded-full bg-rose-500 px-4 py-2 text-xs font-bold text-white">Reject</button>
                    </>
                  ) : null}
                  {order.approvalStatus === "accepted" && progressableStatuses.includes(order.status) ? (
                    <button
                      type="button"
                      onClick={() => runAction(() => restaurantDeliverOrder(order.orderId), "Order status updated.")}
                      className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white"
                    >
                      {order.status === "Accepted" ? "Start Preparing" : order.status === "Preparing" ? "Out for Delivery" : "Mark Delivered"}
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div id="reservations" className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Reservation Management</p>
          <div className="mt-4 space-y-4">
            {restaurantAdminDashboard.reservations.map((reservation) => (
              <article key={reservation.reservationId} className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="font-bold text-slate-900">{reservation.date} | {reservation.time}</p>
                <p className="mt-1 text-sm text-slate-600">{reservation.type} | {reservation.guests} guest(s)</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-500">{reservation.status}</p>
                {reservation.status === "pending" ? (
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => runAction(() => restaurantDecideReservation(reservation.reservationId, "approved"), "Reservation approved.")} className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white">Accept</button>
                    <button type="button" onClick={() => runAction(() => restaurantDecideReservation(reservation.reservationId, "rejected"), "Reservation rejected.")} className="rounded-full bg-rose-500 px-4 py-2 text-xs font-bold text-white">Reject</button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default RestaurantAdminPanel;
