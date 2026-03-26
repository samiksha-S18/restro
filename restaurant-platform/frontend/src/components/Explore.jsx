import { Link } from "react-router-dom";

function Explore() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Explore</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">Want the full restaurant directory?</h2>
      </div>
      <Link to="/restaurants" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.02]">
        Explore Restaurants
      </Link>
    </div>
  );
}

export default Explore;
