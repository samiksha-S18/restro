import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDefaultRouteForRole, useApp } from "../context/appContextShared";

function Register() {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    restaurantName: "",
    cuisine: "",
    location: "",
    priceForTwo: "",
    deliveryTime: "",
  });
  const [message, setMessage] = useState("");

  const isRestaurantAdmin = form.role === "restaurant_admin";

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const data = await signup(form);
      navigate(getDefaultRouteForRole(data.user.role));
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <section className="rounded-[2rem] bg-white p-8 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Register</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">
          {isRestaurantAdmin ? "Create your restaurant admin account" : "Create your account"}
        </h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500" htmlFor="role">
              Register As
            </label>
            <select
              id="role"
              value={form.role}
              onChange={(event) => updateField("role", event.target.value)}
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none"
            >
              <option value="user">User</option>
              <option value="restaurant_admin">Restaurant Admin</option>
            </select>
          </div>
          <input value={form.name} onChange={(event) => updateField("name", event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400" placeholder="Full name" />
          <input value={form.email} onChange={(event) => updateField("email", event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400" placeholder="Email" />
          <input type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400" placeholder="Password" />
          {isRestaurantAdmin ? (
            <>
              <input value={form.restaurantName} onChange={(event) => updateField("restaurantName", event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400" placeholder="Restaurant name" />
              <input value={form.cuisine} onChange={(event) => updateField("cuisine", event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400" placeholder="Cuisine type" />
              <input value={form.location} onChange={(event) => updateField("location", event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400" placeholder="Restaurant location" />
              <input type="number" min="0" value={form.priceForTwo} onChange={(event) => updateField("priceForTwo", event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400" placeholder="Average price for two" />
              <input value={form.deliveryTime} onChange={(event) => updateField("deliveryTime", event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400" placeholder="Delivery time (e.g. 30-40 mins)" />
            </>
          ) : null}
          <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white">
            {isRestaurantAdmin ? "Register Restaurant Admin" : "Register"}
          </button>
        </form>
        {message ? <p className="mt-4 text-sm font-semibold text-rose-500">{message}</p> : null}
        <p className="mt-4 text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-violet-600">Login</Link></p>
      </section>
    </main>
  );
}

export default Register;
