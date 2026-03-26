import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/appContextShared";

const moods = ["Happy", "Sad", "Angry", "Stressed", "Party Mood", "Romantic"];

function MoodAssistant() {
  const { user, recommendations, requestRecommendations } = useApp();
  const [selectedMood, setSelectedMood] = useState("Happy");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRecommend() {
    setLoading(true);
    setMessage("");
    try {
      const data = await requestRecommendations(selectedMood);
      setMessage(`${data.recommendations.length} recommendations prepared for your ${selectedMood.toLowerCase()} mood.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-white bg-white p-6 shadow-[0_18px_60px_rgba(124,58,237,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Mood Mode</p>
      <h2 className="mt-2 text-2xl font-black text-slate-900">How are you feeling today?</h2>
      <div className="mt-5 flex flex-wrap gap-3">
        {moods.map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => setSelectedMood(mood)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedMood === mood ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700 hover:bg-violet-100"
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleRecommend}
        disabled={!user || loading}
        className="mt-5 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {user ? (loading ? "Finding Matches..." : "Get Suggestions") : "Login to Use AI Assistant"}
      </button>
      {message ? <p className="mt-4 text-sm font-semibold text-violet-700">{message}</p> : null}
      {!!recommendations.length && (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recommendations.map((item) => (
            <Link
              key={`${item.restaurantId}-${item.itemId}`}
              to={`/restaurant/${item.restaurantId}`}
              className="rounded-[1.5rem] bg-slate-50 p-4 transition hover:-translate-y-1"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500">{item.restaurantName}</p>
              <h3 className="mt-2 text-lg font-black text-slate-900">{item.name}</h3>
              <p className="mt-2 text-sm text-slate-600">INR {item.price}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default MoodAssistant;
