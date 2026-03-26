import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import RestaurantCard from "../components/RestaurantCard";
import { useApp } from "../context/appContextShared";

function Restaurants() {
  const { restaurants } = useApp();
  const [searchParams] = useSearchParams();
  const foodFilter = searchParams.get("food");
  const modeFilter = searchParams.get("mode") || "all";

  const visibleRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) =>
      restaurant.menu.some((item) => {
        const matchesFood =
          !foodFilter ||
          item.id.toLowerCase() === foodFilter.toLowerCase() ||
          item.name.toLowerCase().includes(foodFilter.toLowerCase());
        const matchesMode = modeFilter === "all" || item.type === modeFilter;
        return matchesFood && matchesMode;
      })
    );
  }, [restaurants, foodFilter, modeFilter]);

  const matchedFoodName = useMemo(() => {
    if (!foodFilter) {
      return "";
    }

    for (const restaurant of restaurants) {
      const matched = restaurant.menu.find(
        (item) =>
          item.id.toLowerCase() === foodFilter.toLowerCase() ||
          item.name.toLowerCase().includes(foodFilter.toLowerCase())
      );
      if (matched) {
        return matched.name;
      }
    }

    return foodFilter;
  }, [restaurants, foodFilter]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
          {foodFilter ? "Food Search Results" : "All Restaurants"}
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">
          {foodFilter
            ? `Restaurants serving ${matchedFoodName}${modeFilter !== "all" ? ` (${modeFilter})` : ""}`
            : modeFilter !== "all"
              ? `${modeFilter === "veg" ? "Veg" : "Non-Veg"} restaurants and dishes`
              : "Choose where to eat tonight"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          {foodFilter
            ? "These restaurants currently sell the food item you selected from the home page."
            : "Explore full menus, book tables, add reviews, and order directly from the restaurant page."}
        </p>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {visibleRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} modeFilter={modeFilter} foodFilter={foodFilter} />
        ))}
      </section>
    </main>
  );
}

export default Restaurants;
