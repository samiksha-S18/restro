import { Link } from "react-router-dom";
import MediaThumb from "./MediaThumb";

function RestaurantCard({ restaurant, modeFilter = "all", foodFilter = "" }) {
  const previewItems = restaurant.menu.filter((item) => {
    const matchesMode = modeFilter === "all" || item.type === modeFilter;
    const matchesFood =
      !foodFilter ||
      item.id.toLowerCase() === foodFilter.toLowerCase() ||
      item.name.toLowerCase().includes(foodFilter.toLowerCase());
    return matchesMode && matchesFood;
  });

  return (
    <Link
      to={`/restaurant/${restaurant.id}${modeFilter !== "all" ? `?mode=${encodeURIComponent(modeFilter)}` : ""}`}
      className="group overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_18px_60px_rgba(124,58,237,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(124,58,237,0.16)]"
    >
      <div className="relative h-56 overflow-hidden">
        <div className="transition duration-500 group-hover:scale-105">
          <MediaThumb src={restaurant.coverImage} alt={restaurant.name} className="h-56 w-full" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950/80 to-transparent px-5 py-4 text-white">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em]">
            {restaurant.badge}
          </span>
          <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold">
            {restaurant.rating}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{restaurant.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{restaurant.cuisine}</p>
          </div>
          <span className={`rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white ${restaurant.accent}`}>
            {restaurant.distance}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          <span className="rounded-full bg-violet-50 px-3 py-2 text-violet-700">{restaurant.deliveryTime}</span>
          <span className="rounded-full bg-fuchsia-50 px-3 py-2 text-fuchsia-700">INR {restaurant.priceForTwo} for two</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">{restaurant.location}</span>
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {previewItems.slice(0, 3).map((item) => (
            <div key={item.id} className="min-w-[140px] rounded-2xl bg-slate-100 p-3">
              <p className={`text-[11px] font-bold uppercase tracking-[0.25em] ${item.type === "veg" ? "text-emerald-600" : "text-rose-600"}`}>
                {item.type}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default RestaurantCard;
