import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/appContextShared";

function Cart() {
  const { cart, updateCartItem, user } = useApp();
  const navigate = useNavigate();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal ? 49 : 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Cart</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Your food bag</h1>
        <p className="mt-3 text-sm text-slate-600">Adjust quantities and place the order when you are ready.</p>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {cart.length ? (
            cart.map((item) => (
              <div key={item.id} className="rounded-[2rem] bg-white p-5 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.restaurantName}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-violet-500">{item.type}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => updateCartItem(item.id, item.quantity - 1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 font-bold text-violet-700">
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900">{item.quantity}</span>
                    <button type="button" onClick={() => updateCartItem(item.id, item.quantity + 1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 font-bold text-white">
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">INR {item.price * item.quantity}</p>
                    <p className="mt-1 text-sm text-slate-500">INR {item.price} each</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[2rem] bg-white p-8 text-center shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
              <p className="text-lg font-bold text-slate-900">Your cart is empty</p>
              <Link to="/restaurants" className="mt-4 inline-flex rounded-full bg-violet-600 px-5 py-3 text-sm font-bold text-white">
                Browse Restaurants
              </Link>
            </div>
          )}
        </div>

        <aside className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-300">Summary</p>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Subtotal</span>
              <span className="font-semibold">INR {subtotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Delivery</span>
              <span className="font-semibold">INR {delivery}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-black">
              <span>Total</span>
              <span>INR {subtotal + delivery}</span>
            </div>
          </div>
          <button
            type="button"
            disabled={!user || !cart.length}
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {!user ? "Login to Checkout" : "Continue to Checkout"}
          </button>
        </aside>
      </section>
    </main>
  );
}

export default Cart;
