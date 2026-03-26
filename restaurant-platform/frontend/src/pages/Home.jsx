import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Offers from "../components/Offers";
import MediaThumb from "../components/MediaThumb";
import MoodAssistant from "../components/MoodAssistant";
import { useApp } from "../context/appContextShared";

function Home() {
  const { restaurants, loading, user, offers } = useApp();
  const [foodMode, setFoodMode] = useState("all");
  const [maxPrice, setMaxPrice] = useState(450);

  const filteredRestaurants = useMemo(
    () =>
      restaurants.filter((restaurant) =>
        restaurant.menu.some((item) => (foodMode === "all" || item.type === foodMode) && item.price <= maxPrice)
      ),
    [restaurants, foodMode, maxPrice]
  );

  const recommendedFoods = useMemo(() => {
    const items = filteredRestaurants.flatMap((restaurant) =>
      restaurant.menu
        .filter((item) => (foodMode === "all" || item.type === foodMode) && item.price <= maxPrice)
        .map((item) => ({
          ...item,
          restaurantCount: filteredRestaurants.filter((place) =>
            place.menu.some((menuItem) => menuItem.id === item.id || menuItem.name === item.name)
          ).length,
        }))
    );

    const unique = [];
    const seen = new Set();
    for (const item of items) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        unique.push(item);
      }
    }
    return unique.slice(0, 6);
  }, [filteredRestaurants, foodMode, maxPrice]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] bg-gradient-to-br from-violet-700 via-fuchsia-600 to-purple-500 p-8 text-white shadow-[0_24px_80px_rgba(139,92,246,0.3)]">
          <div className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
            Hunger
          </div>
          <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
            Order food and reserve tables with live tracking.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/85">
            A complete food ordering platform with allergy checks, reservations, checkout flow, and role-based dashboards.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {!user ? (
              <Link to="/signup" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-violet-700 transition hover:scale-[1.02]">
                Signup Now
              </Link>
            ) : (
              <Link to="/profile" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-violet-700 transition hover:scale-[1.02]">
                Open Profile
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Filters</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {["all", "veg", "non-veg"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setFoodMode(mode)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  foodMode === mode ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                }`}
              >
                {mode === "all" ? "All Food" : mode === "veg" ? "Veg Only" : "Non-Veg"}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-700">Price Range</p>
              <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-sm font-semibold text-fuchsia-700">
                Up to INR {maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="500"
              step="10"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-violet-100 accent-fuchsia-500"
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-violet-50 p-4">
              <p className="text-2xl font-black text-violet-700">{filteredRestaurants.length}</p>
              <p className="mt-1 text-sm text-slate-600">Restaurants matching your filters</p>
            </div>
            <div className="rounded-2xl bg-fuchsia-50 p-4">
              <p className="text-2xl font-black text-fuchsia-700">{recommendedFoods.length}</p>
              <p className="mt-1 text-sm text-slate-600">Food picks matched for you</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <Offers offers={offers} />
      </div>

      <div className="mt-8">
        <MoodAssistant />
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Food Recommendations</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Tap a dish to see who serves it</h2>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 rounded-[2rem] bg-white p-8 text-center text-slate-500 shadow-sm">
            Loading food recommendations...
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recommendedFoods.map((item) => (
              <Link
                key={item.id}
                to={`/restaurants?food=${encodeURIComponent(item.id)}${foodMode !== "all" ? `&mode=${encodeURIComponent(foodMode)}` : ""}`}
                className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_18px_60px_rgba(124,58,237,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(124,58,237,0.16)]"
              >
                <MediaThumb src={item.image} alt={item.name} className="h-52 w-full" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${item.type === "veg" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        {item.type}
                      </p>
                      <h3 className="mt-3 text-xl font-black text-slate-900">{item.name}</h3>
                    </div>
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                      {item.rating} star
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                  <div className="mt-4 flex items-center justify-between text-sm font-semibold">
                    <span className="text-slate-900">INR {item.price}</span>
                    <span className="text-violet-600">{item.restaurantCount} restaurant(s)</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
