const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80";
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];

function MediaThumb({ src, alt, className = "", type = "image" }) {
  const isVideoSource =
    type === "video" &&
    VIDEO_EXTENSIONS.some((extension) => String(src || "").toLowerCase().includes(extension));

  return (
    <div className={`overflow-hidden ${className}`}>
      {isVideoSource ? (
        <video src={src} className="h-full w-full object-cover" controls preload="metadata" />
      ) : (
        <img
          src={src || FALLBACK_IMAGE}
          alt={alt}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="h-full w-full object-cover"
        />
      )}
      {type === "video" && !isVideoSource ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/20">
          <div className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-violet-700">
            Video
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default MediaThumb;
