import { useApp } from "../context/appContextShared";

function AllergyModal() {
  const { allergyWarning, setAllergyWarning } = useApp();

  if (!allergyWarning) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(124,58,237,0.2)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">Allergy Alert</p>
        <h3 className="mt-2 text-2xl font-black text-slate-900">{allergyWarning.itemName}</h3>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          This item may contain: {allergyWarning.allergens.join(", ")}. Update your profile allergies or choose another item.
        </p>
        <button
          type="button"
          onClick={() => setAllergyWarning(null)}
          className="mt-6 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white"
        >
          Understood
        </button>
      </div>
    </div>
  );
}

export default AllergyModal;
