import { useApp } from "../context/appContextShared";

function NotificationPopup() {
  const { popupNotifications, dismissPopup } = useApp();

  if (!popupNotifications.length) {
    return null;
  }

  return (
    <div className="fixed right-4 top-20 z-[60] flex w-[min(92vw,380px)] flex-col gap-3">
      {popupNotifications.slice(0, 3).map((notification) => (
        <div
          key={notification.id}
          className="rounded-[1.5rem] border border-violet-100 bg-white/95 p-4 shadow-[0_18px_60px_rgba(124,58,237,0.16)] backdrop-blur"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-500">{notification.type}</p>
              <h3 className="mt-1 text-lg font-black text-slate-900">{notification.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{notification.message}</p>
            </div>
            <button
              type="button"
              onClick={() => dismissPopup(notification.id)}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationPopup;
