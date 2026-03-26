import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDefaultRouteForRole, useApp } from "../context/appContextShared";

function Register() {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [message, setMessage] = useState("");

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
        <h1 className="mt-2 text-3xl font-black text-slate-900">Create your account</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400" placeholder="Full name" />
          <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400" placeholder="Email" />
          <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400" placeholder="Password" />
          <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white">
            Register
          </button>
        </form>
        {message ? <p className="mt-4 text-sm font-semibold text-rose-500">{message}</p> : null}
        <p className="mt-4 text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-violet-600">Login</Link></p>
      </section>
    </main>
  );
}

export default Register;
