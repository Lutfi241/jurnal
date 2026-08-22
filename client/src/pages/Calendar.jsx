import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function CalendarPage() {
  const [cursor, setCursor] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.listEntries().then(setEntries);
  }, []);

  const byDay = useMemo(() => {
    const map = {};
    for (const e of entries) {
      const day = e.created_at.slice(0, 10);
      if (!map[day]) map[day] = [];
      map[day].push(e);
    }
    return map;
  }, [entries]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function keyFor(d) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  const selectedEntries = selected ? byDay[selected] || [] : [];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-paper-100">
          {monthNames[month]} {year}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="w-8 h-8 rounded border border-ink-700 text-paper-200 hover:border-ember-500"
          >
            ‹
          </button>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="w-8 h-8 rounded border border-ink-700 text-paper-200 hover:border-ember-500"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-ink-600 text-xs font-mono py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5 mb-8">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const key = keyFor(d);
          const count = byDay[key]?.length || 0;
          const isToday = key === new Date().toISOString().slice(0, 10);
          return (
            <button
              key={i}
              onClick={() => setSelected(key)}
              className={`aspect-square rounded border flex flex-col items-center justify-center text-sm transition-colors ${
                selected === key
                  ? "border-ember-500 bg-ember-500/10"
                  : isToday
                  ? "border-dusk-400/60"
                  : "border-ink-700 hover:border-ink-600"
              }`}
            >
              <span className="text-paper-100">{d}</span>
              {count > 0 && <span className="w-1.5 h-1.5 rounded-full bg-ember-400 mt-1" />}
            </button>
          );
        })}
      </div>

      {selected && (
        <div>
          <p className="text-ink-600 text-xs font-mono uppercase tracking-wide mb-3">
            Entri pada {selected}
          </p>
          {selectedEntries.length === 0 ? (
            <p className="text-ink-600 text-sm">Tidak ada entri di tanggal ini.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedEntries.map((e) => (
                <Link
                  key={e.id}
                  to={`/tulis/${e.id}`}
                  className="bg-ink-900 border border-ink-700 rounded p-4 hover:border-ember-500/50 transition-colors"
                >
                  <p className="text-paper-100 font-medium">{e.title || "(tanpa judul)"}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
