import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDefaultRouteForRole, useApp } from "../context/appContextShared";

const roleDefaults = {
  user: "user@foodconnect.app",
  restaurant_admin: "spice@foodconnect.app",
  super_admin: "demo@foodconnect.app",
};

function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: roleDefaults.user, password: "demo123", role: "user" });
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const data = await login(form);
      navigate(getDefaultRouteForRole(data.user.role));
    } catch (error) {
      setMessage(error.message);
    }
  }

  function updateRole(nextRole) {
    setForm((current) => ({
      ...current,
      role: nextRole,
      email: roleDefaults[nextRole],
    }));
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <section className="rounded-[2rem] bg-white p-8 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Login</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Welcome back</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500" htmlFor="role">
              Select Role
            </label>
            <select
              id="role"
              value={form.role}
              onChange={(event) => updateRole(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none"
            >
              <option value="user">User</option>
              <option value="restaurant_admin">Restaurant Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400" placeholder="Email" />
          <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400" placeholder="Password" />
          <button type="submit" className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Login</button>
        </form>
        <div className="mt-4 rounded-[1.5rem] bg-violet-50 p-4 text-xs text-slate-600">
          <p>User: user@foodconnect.app / demo123</p>
          <p className="mt-2">Restaurant Admin: spice@foodconnect.app / demo123</p>
          <p className="mt-2">Super Admin: demo@foodconnect.app / demo123</p>
        </div>
        {message ? <p className="mt-4 text-sm font-semibold text-rose-500">{message}</p> : null}
        <div className="mt-4 rounded-[1.5rem] bg-violet-50 p-4 text-sm text-slate-600">
          <p>New user?</p>
          <Link to="/signup" className="mt-3 inline-flex rounded-full bg-violet-600 px-4 py-2 font-semibold text-white">
            Register
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Login;
