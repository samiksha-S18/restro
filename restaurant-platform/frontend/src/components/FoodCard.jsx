import MediaThumb from "./MediaThumb";

function FoodCard({ item, onAdd, onRemove, quantity = 0, isAdding = false, isUpdating = false }) {
  const isAdded = quantity > 0;
  const moodEmoji = isAdded ? "😄" : "😞";
  const moodLabel = isAdded ? `Added x${quantity}` : "Not added";

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-sm">
      <MediaThumb src={item.image} alt={item.name} className="h-40 w-full" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex gap-2">
              <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${item.type === "veg" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                {item.type}
              </span>
              <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-700">
                {item.rating} stars
              </span>
            </div>
            <h4 className="mt-3 text-lg font-bold text-slate-900">{item.name}</h4>
            <p className="mt-1 text-sm text-slate-500">{item.description}</p>
          </div>
          <div className={`flex min-w-[92px] flex-col items-center rounded-[1.25rem] px-3 py-3 text-center ${isAdded ? "bg-emerald-50" : "bg-rose-50"}`}>
            <span className="text-3xl leading-none">{moodEmoji}</span>
            <span className={`mt-2 text-xs font-bold uppercase tracking-[0.18em] ${isAdded ? "text-emerald-700" : "text-rose-700"}`}>
              {moodLabel}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm font-semibold text-slate-700">
          <span>INR {item.price}</span>
          <span className="text-xs text-slate-500">
            Allergens: {item.allergens.length ? item.allergens.join(", ") : "None"}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          {isAdded ? (
            <>
              <button
                type="button"
                onClick={onRemove}
                disabled={isUpdating}
                className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={onAdd}
                disabled={isAdding || isUpdating}
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Add More
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              disabled={isAdding}
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAdding ? "Adding..." : "Add"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default FoodCard;
