import { useState } from "react";
import { Link } from "react-router-dom";
import MediaThumb from "../components/MediaThumb";
import OrderTrackingMap from "../components/OrderTrackingMap";
import { useApp } from "../context/appContextShared";

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path d="M4 8h3l1.5-2h7L17 8h3v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

function Profile() {
  const { user, orders, bookings, activeOrders, updateAllergies, updateSettings, notifications, createPost, logout } = useApp();
  const [message, setMessage] = useState("");
  const [postForm, setPostForm] = useState({ orderId: "", mediaType: "image", mediaUrl: "", caption: "" });

  async function toggleAllergy(name) {
    const next =
      name === "__clear__"
        ? []
        : user.allergies.includes(name)
          ? user.allergies.filter((item) => item !== name)
          : [...user.allergies, name];
    await updateAllergies(next);
    setMessage("Allergies updated.");
  }

  async function toggleNotifications() {
    await updateSettings({ notifications: !user.settings.notifications });
    setMessage("Settings updated.");
  }

  async function handlePostSubmit(event) {
    event.preventDefault();
    const selectedOrder = orders.find((order) => (order.orderId || order.id) === postForm.orderId);

    if (!selectedOrder) {
      setMessage("Select an order first.");
      return;
    }

    try {
      await createPost({
        restaurantId: selectedOrder.restaurantId,
        mediaType: postForm.mediaType,
        mediaUrl: postForm.mediaUrl,
        caption: postForm.caption,
      });
      setPostForm({ orderId: "", mediaType: "image", mediaUrl: "", caption: "" });
      setMessage("Photo or video post shared.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handlePostFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const mediaUrl = await readFileAsDataUrl(file);
      setPostForm((current) => ({
        ...current,
        mediaUrl,
        mediaType: file.type.startsWith("video/") ? "video" : "image",
      }));
      setMessage(`${file.type.startsWith("video/") ? "Video" : "Image"} selected.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      event.target.value = "";
    }
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <h1 className="text-3xl font-black text-slate-900">Please login first</h1>
          <Link to="/login" className="mt-5 inline-flex rounded-full bg-violet-600 px-5 py-3 text-sm font-bold text-white">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-gradient-to-br from-violet-700 via-fuchsia-600 to-purple-500 p-8 text-white shadow-[0_24px_80px_rgba(139,92,246,0.3)]">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-black text-violet-700">
                {user.avatar}
              </div>
              <div>
                <p className="text-2xl font-black">{user.name}</p>
                <p className="text-sm text-white/80">{user.email}</p>
              </div>
            </div>
            <button type="button" onClick={logout} className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-bold text-violet-700">
              Logout
            </button>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Allergies</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => toggleAllergy("__clear__")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${user.allergies.length === 0 ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-700"}`}
              >
                No Allergy
              </button>
              {["Dairy", "Gluten", "Nuts", "Soy", "Egg"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleAllergy(item)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    user.allergies.includes(item) ? "bg-rose-500 text-white" : "bg-violet-50 text-violet-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Settings</p>
            <button type="button" onClick={toggleNotifications} className="mt-4 rounded-full bg-slate-950 px-4 py-3 text-sm font-bold text-white">
              Notifications: {user.settings.notifications ? "On" : "Off"}
            </button>
          </div>
          {message ? <p className="rounded-2xl bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700">{message}</p> : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Live Order Status</p>
            <div className="mt-4 space-y-4">
              {activeOrders.length ? activeOrders.map((order) => (
                <div key={order.orderId || order.id} className="rounded-[1.5rem] bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900">{order.restaurantName}</p>
                      <p className="mt-1 text-sm text-slate-500">{order.status}</p>
                    </div>
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">{order.approvalStatus}</span>
                  </div>
                  {order.status === "Pending" ? (
                    <div className="mt-4 rounded-[1.25rem] bg-violet-50 p-4 text-sm font-semibold text-violet-700">
                      Waiting for restaurant approval.
                    </div>
                  ) : (
                    <OrderTrackingMap order={order} />
                  )}
                </div>
              )) : <p className="text-sm text-slate-500">No active orders right now.</p>}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Order History</p>
            <div className="mt-4 space-y-4">
              {orders.map((order) => (
                <div key={order.orderId || order.id} className="rounded-[1.5rem] bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900">{order.restaurantName}</p>
                      <p className="mt-1 text-sm text-slate-500">{new Date(order.placedAt).toLocaleString()}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">{order.status}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{(order.items || []).map((item) => item.name || item).join(", ")}</p>
                  {order.orderNote ? <p className="mt-2 text-sm text-slate-500">Note: {order.orderNote}</p> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Order Media</p>
                <p className="mt-2 text-2xl font-black text-slate-900">Post photo or video from your order</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                <CameraIcon />
              </div>
            </div>
            <form onSubmit={handlePostSubmit} className="mt-5 space-y-4">
              <select value={postForm.orderId} onChange={(event) => setPostForm((current) => ({ ...current, orderId: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none">
                <option value="">Select delivered or placed order</option>
                {orders.map((order) => (
                  <option key={order.orderId || order.id} value={order.orderId || order.id}>
                    {order.restaurantName} | {new Date(order.placedAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
              <div className="grid gap-4 sm:grid-cols-2">
                <select value={postForm.mediaType} onChange={(event) => setPostForm((current) => ({ ...current, mediaType: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none">
                  <option value="image">Photo</option>
                  <option value="video">Video</option>
                </select>
                <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-violet-300 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700">
                  <input type="file" accept="image/*,video/*" onChange={handlePostFileChange} className="hidden" />
                  Upload Photo / Video
                </label>
              </div>
              {postForm.mediaUrl ? <p className="text-sm text-slate-500">Media file selected.</p> : null}
              <textarea value={postForm.caption} onChange={(event) => setPostForm((current) => ({ ...current, caption: event.target.value }))} className="h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Write about your order experience" />
              <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-bold text-white">
                <CameraIcon />
                Post Photo / Video
              </button>
            </form>

            <div className="mt-6 space-y-4">
              {(user.postHistory || []).length ? user.postHistory.filter((post) => post.status !== "deleted").map((post) => (
                <div key={post.postId || post.id} className="rounded-[1.5rem] bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">{post.restaurantName}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-500">{post.mediaType}</p>
                    </div>
                    <span className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="relative mt-4 h-44 overflow-hidden rounded-[1.25rem]">
                    <MediaThumb src={post.mediaUrl} alt={post.caption} type={post.mediaType} className="h-full w-full" />
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{post.caption}</p>
                </div>
              )) : <p className="text-sm text-slate-500">No food posts yet.</p>}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Bookings</p>
            <div className="mt-4 space-y-4">
              {bookings.length ? bookings.map((booking) => (
                <div key={booking.reservationId || booking.id} className="rounded-[1.5rem] bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">{booking.restaurantName}</p>
                  <p className="mt-1 text-sm text-slate-500">{booking.type} | {booking.date} | {booking.time}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-500">{booking.status || "pending"}</p>
                </div>
              )) : <p className="text-sm text-slate-500">No bookings yet.</p>}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Notifications</p>
            <div className="mt-4 space-y-3">
              {notifications.length ? notifications.slice(0, 6).map((notification) => (
                <div key={notification.id} className="rounded-[1.25rem] bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">{notification.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                </div>
              )) : <p className="text-sm text-slate-500">No notifications yet.</p>}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;
