import { Link } from "react-router-dom";
import { useApp } from "../context/appContextShared";

function FloatingCartButton() {
  const { cart, user } = useApp();

  if (user?.isAdmin) {
    return null;
  }

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const latestItem = cart[cart.length - 1];
  const label = count === 0 ? "😶" : "😄";
  const caption = count === 0 ? "Nothing added" : "Feeling hungry";

  return (
    <Link
      to="/cart"
      className="fixed bottom-5 right-5 z-50 flex min-h-20 min-w-20 max-w-[220px] animate-pulse items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-violet-600 to-fuchsia-500 px-4 py-3 text-white shadow-[0_18px_60px_rgba(124,58,237,0.45)] transition duration-300 hover:scale-105"
    >
      <div className="text-center">
        <span className="block text-2xl leading-none">{label}</span>
        <span className="mt-1 block text-[11px] font-black uppercase tracking-[0.2em]">{caption}</span>
        <span className="text-xs font-bold">{count} item(s)</span>
        {latestItem ? (
          <span className="mt-1 block max-w-[160px] truncate text-[11px] font-medium text-white/85">
            {latestItem.name}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

export default FloatingCartButton;
