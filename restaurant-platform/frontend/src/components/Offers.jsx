function Offers({ offers }) {
  const visibleOffers = offers.slice(0, 3).map((offer) => ({
    id: offer.id,
    title: offer.title,
    subtitle: offer.description || offer.subtitle,
    code: offer.code,
  }));

  return (
    <section className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Offers & Recommendations</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {visibleOffers.map((offer) => (
          <div key={offer.id} className="rounded-[1.75rem] bg-gradient-to-br from-violet-600 via-fuchsia-500 to-purple-500 p-5 text-white">
            <p className="text-lg font-black">{offer.title}</p>
            <p className="mt-2 text-sm text-white/85">{offer.subtitle}</p>
            {offer.code ? <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-white/80">{offer.code}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Offers;
