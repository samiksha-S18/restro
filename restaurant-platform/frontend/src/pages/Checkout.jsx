import { useState } from "react";
import { Link } from "react-router-dom";
import OrderTrackingMap from "../components/OrderTrackingMap";
import { useApp } from "../context/appContextShared";

function Checkout() {
  const { cart, user, checkoutCart, checkoutDraft, setCheckoutDraft } = useApp();
  const [message, setMessage] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal ? 49 : 0;

  async function handleConfirm() {
    try {
      const data = await checkoutCart(checkoutDraft);
      setConfirmedOrder(data.order);
      setShowPopup(true);
      setMessage(`Order submitted to ${data.order.restaurantName}.`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
          <h1 className="text-3xl font-black text-slate-900">Login required</h1>
          <Link to="/login" className="mt-5 inline-flex rounded-full bg-violet-600 px-5 py-3 text-sm font-bold text-white">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Checkout</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Address and payment</h1>
      </section>

      {message ? <p className="mt-4 rounded-2xl bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700">{message}</p> : null}

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">1. Delivery Address</p>
            <textarea
              value={checkoutDraft.address}
              onChange={(event) => setCheckoutDraft((current) => ({ ...current, address: event.target.value }))}
              className="mt-4 h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400"
            />
            <textarea
              value={checkoutDraft.orderNote}
              onChange={(event) => setCheckoutDraft((current) => ({ ...current, orderNote: event.target.value }))}
              className="mt-4 h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-400"
              placeholder="Add a custom note for the restaurant"
            />
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">2. Payment Method</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["Credit / Debit Card", "UPI", "Netbanking"].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setCheckoutDraft((current) => ({ ...current, paymentMethod: method }))}
                  className={`rounded-2xl px-4 py-4 text-sm font-semibold transition ${
                    checkoutDraft.paymentMethod === method
                      ? "bg-violet-600 text-white"
                      : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {confirmedOrder && !showPopup ? (
            <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Tracking Map</p>
              <OrderTrackingMap order={confirmedOrder} />
              {confirmedOrder.approvalStatus !== "accepted" ? (
                <div className="mt-4 rounded-[1.25rem] bg-violet-50 p-4 text-sm font-semibold text-violet-700">
                  Payment confirmed. Your order is now waiting for restaurant approval.
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <aside className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-300">3. Confirm Order</p>
          <div className="mt-4 space-y-3 text-sm">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <span>{item.name} x{item.quantity}</span>
                <span>INR {item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-white/10 pt-4 text-sm">
            <div className="flex items-center justify-between"><span className="text-white/70">Subtotal</span><span>INR {subtotal}</span></div>
            <div className="mt-2 flex items-center justify-between"><span className="text-white/70">Delivery</span><span>INR {delivery}</span></div>
            <div className="mt-3 flex items-center justify-between text-lg font-black"><span>Total</span><span>INR {subtotal + delivery}</span></div>
          </div>
          <button
            type="button"
            disabled={!cart.length || !checkoutDraft.address}
            onClick={handleConfirm}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            Confirm Payment
          </button>
        </aside>
      </section>

      {showPopup && confirmedOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(124,58,237,0.18)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Payment Confirmed</p>
            <h3 className="mt-2 text-2xl font-black text-slate-900">{confirmedOrder.restaurantName}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your payment is confirmed and the order has been placed successfully. Continue to see the live tracking map.
            </p>
            <button type="button" onClick={() => setShowPopup(false)} className="mt-6 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">
              Show Tracking
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default Checkout;
