import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import StreakLedger from "../components/StreakLedger";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.stats().then(setStats);
    api.listEntries().then((rows) => setRecent(rows.slice(0, 5)));
  }, []);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="max-w-4xl">
      <header className="mb-8">
        <p className="text-ink-600 font-mono text-xs uppercase tracking-widest mb-1">{today}</p>
        <h1 className="font-display text-3xl text-paper-100">Selamat datang kembali.</h1>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-ink-900 border border-ink-700 rounded p-5">
          <p className="text-ink-600 text-xs font-mono uppercase tracking-wide mb-2">Runtutan hari</p>
          <p className="font-display text-4xl text-ember-400">{stats?.streak ?? "–"}</p>
        </div>
        <div className="bg-ink-900 border border-ink-700 rounded p-5">
          <p className="text-ink-600 text-xs font-mono uppercase tracking-wide mb-2">Total entri</p>
          <p className="font-display text-4xl text-paper-100">{stats?.totalEntries ?? "–"}</p>
        </div>
        <div className="bg-ink-900 border border-ink-700 rounded p-5">
          <p className="text-ink-600 text-xs font-mono uppercase tracking-wide mb-2">Tag teratas</p>
          <p className="font-display text-lg text-paper-100 truncate">
            {stats?.topTags?.[0]?.tag ? `#${stats.topTags[0].tag}` : "belum ada"}
          </p>
        </div>
      </div>

      <div className="bg-ink-900 border border-ink-700 rounded p-5 mb-8">
        <p className="text-ink-600 text-xs font-mono uppercase tracking-wide mb-3">
          Jejak menulis · 18 minggu terakhir
        </p>
        <StreakLedger heatmap={stats?.heatmap || {}} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-ink-600 text-xs font-mono uppercase tracking-wide">Entri terbaru</p>
        <Link to="/tulis" className="text-ember-400 text-sm hover:text-ember-500">
          + Tulis baru
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {recent.length === 0 && (
          <p className="text-ink-600 text-sm py-8 text-center border border-dashed border-ink-700 rounded">
            Belum ada entri. Mulai dengan menulis satu.
          </p>
        )}
        {recent.map((e) => (
          <Link
            key={e.id}
            to={`/tulis/${e.id}`}
            className="bg-ink-900 border border-ink-700 rounded p-4 hover:border-ember-500/50 transition-colors flex items-center justify-between"
          >
            <div>
              <p className="text-paper-100 font-medium">{e.title || "(tanpa judul)"}</p>
              <p className="text-ink-600 text-xs mt-0.5">
                {new Date(e.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            {e.mood_score && (
              <span className="font-mono text-xs text-ember-400 border border-ember-500/30 rounded px-2 py-1">
                mood {e.mood_score}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
