import { Link, useLocation } from "react-router-dom";
import { getDefaultRouteForRole, useApp } from "../context/appContextShared";

function Navigate() {
  const { user } = useApp();
  const location = useLocation();
  const hideAuthButtons = location.pathname === "/login" || location.pathname === "/signup";

  const links = user?.role === "super_admin"
    ? [
        ["/super-admin", "Dashboard"],
      ]
    : user?.role === "restaurant_admin"
      ? [
          ["/restaurant-admin", "Dashboard"],
        ]
      : [
          ["/", "Home"],
          ["/restaurants", "Restaurants"],
          ["/reservation", "Reservations"],
          ["/cart", "Cart"],
          ["/profile", "Profile"],
        ];

  function isLinkActive(to) {
    if (!to.includes("#")) {
      return location.pathname === to;
    }

    return `${location.pathname}${location.hash}` === to;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to={user ? getDefaultRouteForRole(user.role) : "/"} className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-2xl shadow-lg">
            H
          </div>
          <div>
            <p className="text-2xl font-black tracking-[0.18em] text-violet-600">Hunger</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
              {user?.role === "super_admin" ? "Super Admin" : user?.role === "restaurant_admin" ? "Restaurant Admin" : "Food Ordering"}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map(([to, label]) => (
            <Link
              key={to}
              to={to}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isLinkActive(to) ? "bg-violet-600 text-white shadow-lg" : "text-slate-600 hover:bg-violet-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!user && !hideAuthButtons ? (
            <>
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-violet-50">
                Login
              </Link>
              <Link to="/signup" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]">
                Register
              </Link>
            </>
          ) : user ? (
            <Link to={getDefaultRouteForRole(user.role)} className="flex items-center gap-3 rounded-full border border-violet-100 bg-violet-50 px-3 py-2 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-bold text-white">
                {user.avatar}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">
                  {user.role === "super_admin" ? "Platform dashboard" : user.role === "restaurant_admin" ? "Restaurant dashboard" : "User profile"}
                </p>
              </div>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Navigate;
