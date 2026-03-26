import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import FoodCard from "../components/FoodCard";
import MediaThumb from "../components/MediaThumb";
import { useApp } from "../context/appContextShared";

const ratingEmojis = {
  1: "😞",
  2: "😐",
  3: "🙂",
  4: "😄",
  5: "😍",
};

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

function RestaurantDetails() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { restaurants, cart, addToCart, updateCartItem, addReview, createBooking, user } = useApp();
  const restaurant = useMemo(() => restaurants.find((item) => item.id === id), [restaurants, id]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "", image: "", itemId: "" });
  const [bookingForm, setBookingForm] = useState({ type: "reserve", date: "", time: "", guests: 2, notes: "" });
  const [message, setMessage] = useState("");
  const [busyItemId, setBusyItemId] = useState("");
  const foodMode = searchParams.get("mode") || "all";

  const visibleMenu = useMemo(() => {
    if (!restaurant) {
      return [];
    }
    return restaurant.menu.filter((item) => foodMode === "all" || item.type === foodMode);
  }, [restaurant, foodMode]);

  if (!restaurant) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">Restaurant not found.</div>
      </main>
    );
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();
    try {
      await addReview(restaurant.id, reviewForm);
      setReviewForm({ rating: 5, comment: "", image: "", itemId: "" });
      setMessage("Review posted successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleReviewImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const image = await readFileAsDataUrl(file);
      setReviewForm((current) => ({ ...current, image }));
      setMessage("Review image selected.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      event.target.value = "";
    }
  }

  async function handleBookingSubmit(event) {
    event.preventDefault();
    try {
      await createBooking(restaurant.id, bookingForm);
      setBookingForm({ type: "reserve", date: "", time: "", guests: 2, notes: "" });
      setMessage("Reservation request sent to the restaurant.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleAddToCart(item) {
    setBusyItemId(item.id);
    try {
      const result = await addToCart(restaurant.id, item);
      if (result) {
        setMessage(`${item.name} added to cart.`);
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyItemId("");
    }
  }

  async function handleRemoveFromCart(item) {
    const cartEntry = cart.find((entry) => entry.itemId === (item.itemId || item.id));
    if (!cartEntry) {
      return;
    }

    setBusyItemId(item.id);
    try {
      await updateCartItem(cartEntry.id || cartEntry.itemId, cartEntry.quantity - 1);
      setMessage(cartEntry.quantity - 1 <= 0 ? `${item.name} removed from cart.` : `${item.name} updated.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyItemId("");
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <MediaThumb src={restaurant.coverImage} alt={restaurant.name} className="h-full min-h-[340px] w-full" />
          <div className="p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">{restaurant.badge}</p>
            <h1 className="mt-3 text-4xl font-black text-slate-900">{restaurant.name}</h1>
            <p className="mt-3 text-base text-slate-600">{restaurant.cuisine} | {restaurant.location}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">{restaurant.rating} rating</span>
              <span className="rounded-full bg-violet-100 px-4 py-2 text-violet-700">{restaurant.deliveryTime}</span>
              <span className="rounded-full bg-fuchsia-100 px-4 py-2 text-fuchsia-700">INR {restaurant.priceForTwo} for two</span>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {restaurant.media.map((media) => (
                <div key={media.id} className="rounded-[1.5rem] bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4">
                  <div className="relative mb-4 h-24 overflow-hidden rounded-2xl">
                    <MediaThumb src={media.url} alt={media.caption} type={media.type} className="h-24 w-full" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-600">{media.type}</p>
                  <p className="mt-4 text-sm font-semibold text-slate-800">{media.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {message ? <p className="mt-4 rounded-2xl bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700">{message}</p> : null}

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-5 flex flex-wrap gap-3">
            {["all", "veg", "non-veg"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSearchParams(mode === "all" ? {} : { mode })}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  foodMode === mode ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                }`}
              >
                {mode === "all" ? "All Items" : mode === "veg" ? "Veg Only" : "Non-Veg Only"}
              </button>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {visibleMenu.map((item) => {
              const cartEntry = cart.find((entry) => entry.itemId === (item.itemId || item.id));
              return (
                <FoodCard
                  key={item.id}
                  item={item}
                  onAdd={() => handleAddToCart(item)}
                  onRemove={() => handleRemoveFromCart(item)}
                  quantity={cartEntry?.quantity || 0}
                  isAdding={busyItemId === item.id}
                  isUpdating={busyItemId === item.id}
                />
              );
            })}
          </div>
          {!visibleMenu.length ? (
            <div className="mt-5 rounded-[1.5rem] bg-white p-5 text-sm font-semibold text-slate-600 shadow-sm">
              No {foodMode === "veg" ? "veg" : "non-veg"} items are available in this restaurant right now.
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Booking</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Reserve or pre-order</h2>
            <form onSubmit={handleBookingSubmit} className="mt-5 space-y-4">
              <select value={bookingForm.type} onChange={(event) => setBookingForm((current) => ({ ...current, type: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none">
                <option value="reserve">Reserve table</option>
                <option value="preorder">Pre-order food</option>
              </select>
              <div className="grid gap-4 sm:grid-cols-2">
                <input type="date" value={bookingForm.date} onChange={(event) => setBookingForm((current) => ({ ...current, date: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
                <input type="time" value={bookingForm.time} onChange={(event) => setBookingForm((current) => ({ ...current, time: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
              </div>
              <input type="number" min="1" value={bookingForm.guests} onChange={(event) => setBookingForm((current) => ({ ...current, guests: Number(event.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Guests" />
              <textarea value={bookingForm.notes} onChange={(event) => setBookingForm((current) => ({ ...current, notes: event.target.value }))} className="h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Special notes" />
              <button type="submit" disabled={!user} className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
                {user ? "Confirm Booking" : "Login to Book"}
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Reviews</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Share your rating and food feedback</h2>
            <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4">
              <select value={reviewForm.itemId} onChange={(event) => setReviewForm((current) => ({ ...current, itemId: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none">
                <option value="">Select food item</option>
                {visibleMenu.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500">Rating</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewForm((current) => ({ ...current, rating }))}
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition ${
                        reviewForm.rating === rating ? "bg-violet-600 text-white shadow-lg shadow-violet-200" : "bg-white hover:bg-violet-100"
                      }`}
                    >
                      {ratingEmojis[rating]}
                    </button>
                  ))}
                </div>
              </div>
              <textarea value={reviewForm.comment} onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))} className="h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Write your review" />
              <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-violet-300 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700">
                <input type="file" accept="image/*" onChange={handleReviewImageChange} className="hidden" />
                Upload Review Image
              </label>
              {reviewForm.image ? <p className="text-sm text-slate-500">Review image selected.</p> : null}
              <button type="submit" disabled={!user} className="w-full rounded-2xl bg-violet-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
                {user ? "Post Review" : "Login to Review"}
              </button>
            </form>

            <div className="mt-6 space-y-4">
              {restaurant.reviews.map((review) => (
                <div key={review.id} className="rounded-[1.5rem] bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-slate-900">{review.userName}</p>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold">
                      {ratingEmojis[review.rating] || "🙂"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>
                  {review.image ? <div className="relative mt-4 h-40 overflow-hidden rounded-[1.25rem]"><MediaThumb src={review.image} alt={review.comment} className="h-full w-full" /></div> : null}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Community Posts</p>
              <div className="mt-4 space-y-4">
                {(restaurant.posts || []).length ? (restaurant.posts || []).map((post) => (
                  <div key={post.id} className="rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">{post.userName}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-500">{post.mediaType}</p>
                      </div>
                      <span className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="relative mt-4 h-48 overflow-hidden rounded-[1.25rem]">
                      <MediaThumb src={post.mediaUrl} alt={post.caption} type={post.mediaType} className="h-full w-full" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{post.caption}</p>
                  </div>
                )) : <p className="text-sm text-slate-500">No user photo or video posts yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <Link to="/cart" className="rounded-full bg-fuchsia-600 px-5 py-3 text-sm font-bold text-white">😄 View Added Items</Link>
      </div>
    </main>
  );
}

export default RestaurantDetails;
