import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [q, setQ] = useState("");

  function load(query = "") {
    api.listEntries(query ? { q: query } : {}).then(setEntries);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-paper-100 mb-6">Semua Entri</h1>

      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          load(e.target.value);
        }}
        placeholder="Cari judul atau isi..."
        className="w-full bg-ink-900 border border-ink-700 rounded px-4 py-2.5 text-paper-100 placeholder:text-ink-600 outline-none focus:border-ember-500 mb-6"
      />

      <div className="flex flex-col gap-2">
        {entries.length === 0 && (
          <p className="text-ink-600 text-sm py-8 text-center border border-dashed border-ink-700 rounded">
            Tidak ada entri yang cocok.
          </p>
        )}
        {entries.map((e) => (
          <Link
            key={e.id}
            to={`/tulis/${e.id}`}
            className="bg-ink-900 border border-ink-700 rounded p-4 hover:border-ember-500/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <p className="text-paper-100 font-medium">{e.title || "(tanpa judul)"}</p>
              <p className="text-ink-600 text-xs font-mono">
                {new Date(e.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            {e.content && (
              <p className="text-paper-200/60 text-sm mt-1.5 line-clamp-2">{e.content}</p>
            )}
            {e.tags.length > 0 && (
              <div className="flex gap-1.5 mt-2">
                {e.tags.map((t) => (
                  <span key={t} className="text-ember-400 text-xs">#{t}</span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
