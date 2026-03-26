function OrderTrackingMap({ order }) {
  const checkpoints = [
    { status: "Pending", x: 8, y: 78 },
    { status: "Accepted", x: 20, y: 64 },
    { status: "Preparing", x: 38, y: 48 },
    { status: "Out for Delivery", x: 66, y: 30 },
    { status: "Delivered", x: 88, y: 16 },
    { status: "Cancelled", x: 18, y: 20 },
    { status: "Declined", x: 18, y: 20 },
  ];

  const currentPoint = checkpoints.find((item) => item.status === order.status) || checkpoints[0];

  return (
    <div className="mt-4 rounded-[1.75rem] bg-gradient-to-br from-violet-100 via-fuchsia-50 to-white p-5">
      <div className="relative h-64 overflow-hidden rounded-[1.5rem] border border-violet-100 bg-[linear-gradient(90deg,_rgba(167,139,250,0.18)_1px,_transparent_1px),linear-gradient(rgba(167,139,250,0.18)_1px,_transparent_1px)] bg-[size:32px_32px]">
        <div className="absolute left-6 top-6 rounded-full bg-white px-3 py-2 text-xs font-bold text-violet-700 shadow">Restaurant</div>
        <div className="absolute bottom-6 right-6 rounded-full bg-white px-3 py-2 text-xs font-bold text-violet-700 shadow">Destination</div>
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <path d="M10 80 C 22 66, 36 54, 48 48 S 72 30, 88 18" fill="none" stroke="url(#route)" strokeWidth="3" strokeLinecap="round" />
          <defs>
            <linearGradient id="route" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="55%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          {checkpoints.map((point) => (
            <circle
              key={point.status}
              cx={point.x}
              cy={point.y}
              r={point.status === order.status ? "3.8" : "2.3"}
              fill={point.status === order.status ? "#0f172a" : "#ffffff"}
              stroke="#8b5cf6"
              strokeWidth="1.5"
            />
          ))}
        </svg>
        <div
          className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950 text-xl text-white shadow-xl"
          style={{ left: `${currentPoint.x}%`, top: `${currentPoint.y}%` }}
        >
          D
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {checkpoints.slice(0, 5).map((step) => (
          <span
            key={step.status}
            className={`rounded-full px-3 py-2 text-xs font-bold ${
              step.status === order.status ? "bg-violet-600 text-white" : "bg-white text-slate-500"
            }`}
          >
            {step.status}
          </span>
        ))}
      </div>
    </div>
  );
}

export default OrderTrackingMap;
