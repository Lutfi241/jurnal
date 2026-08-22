import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { api } from "../api/client";
import StreakLedger from "../components/StreakLedger";

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.stats().then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl text-paper-100 mb-6">Statistik</h1>

      <div className="bg-ink-900 border border-ink-700 rounded p-5 mb-6">
        <p className="text-ink-600 text-xs font-mono uppercase tracking-wide mb-3">Jejak menulis</p>
        <StreakLedger heatmap={stats.heatmap} />
      </div>

      <div className="bg-ink-900 border border-ink-700 rounded p-5 mb-6">
        <p className="text-ink-600 text-xs font-mono uppercase tracking-wide mb-4">Tren mood</p>
        {stats.moodTrend.length === 0 ? (
          <p className="text-ink-600 text-sm">Belum ada data mood.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.moodTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332B22" />
              <XAxis dataKey="date" tick={{ fill: "#8B8FA8", fontSize: 11 }} />
              <YAxis domain={[1, 5]} tick={{ fill: "#8B8FA8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1C1814", border: "1px solid #332B22" }} />
              <Line type="monotone" dataKey="avg" stroke="#FF7A33" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-ink-900 border border-ink-700 rounded p-5">
        <p className="text-ink-600 text-xs font-mono uppercase tracking-wide mb-4">Tag terpopuler</p>
        {stats.topTags.length === 0 ? (
          <p className="text-ink-600 text-sm">Belum ada tag.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {stats.topTags.map((t) => (
              <div key={t.tag} className="flex items-center gap-3">
                <span className="text-paper-200 text-sm w-24 truncate">#{t.tag}</span>
                <div className="flex-1 h-2 bg-ink-800 rounded overflow-hidden">
                  <div
                    className="h-full bg-ember-500"
                    style={{ width: `${(t.count / stats.topTags[0].count) * 100}%` }}
                  />
                </div>
                <span className="text-ink-600 text-xs font-mono">{t.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
