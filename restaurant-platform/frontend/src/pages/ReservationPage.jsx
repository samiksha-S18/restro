import { Link } from "react-router-dom";
import MediaThumb from "../components/MediaThumb";
import { useApp } from "../context/appContextShared";

function ReservationPage() {
  const { restaurants } = useApp();

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Reservation</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Reserve a table or pre-order your meal</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Choose a restaurant below and open its page to book a table or place a pre-order.
        </p>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
            <MediaThumb src={restaurant.coverImage} alt={restaurant.name} className="h-52 w-full" />
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500">{restaurant.badge}</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">{restaurant.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{restaurant.cuisine} | {restaurant.location}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                <span className="rounded-full bg-violet-50 px-3 py-2 text-violet-700">{restaurant.deliveryTime}</span>
                <span className="rounded-full bg-emerald-100 px-3 py-2 text-emerald-700">{restaurant.rating} rating</span>
              </div>
              <Link to={`/restaurant/${restaurant.id}`} className="mt-5 inline-flex rounded-full bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.02]">
                Reservation
              </Link>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default ReservationPage;
