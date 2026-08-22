import { useMemo } from "react";

// Signature element: a hand-ruled "ledger" grid of the last ~18 weeks,
// each mark styled like an ink tally rather than a generic heatmap tile.
export default function StreakLedger({ heatmap = {} }) {
  const weeks = 18;
  const days = useMemo(() => {
    const arr = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = weeks * 7 - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      arr.push({ key, count: heatmap[key] || 0, date: d });
    }
    return arr;
  }, [heatmap]);

  const columns = [];
  for (let i = 0; i < days.length; i += 7) columns.push(days.slice(i, i + 7));

  function shade(count) {
    if (count === 0) return "bg-ink-700/50";
    if (count === 1) return "bg-ember-700";
    if (count === 2) return "bg-ember-600";
    return "bg-ember-400";
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1.5 min-w-max py-1">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            {col.map((d) => (
              <div
                key={d.key}
                title={`${d.key} · ${d.count} entri`}
                className={`w-3 h-3 rounded-[2px] ${shade(d.count)} transition-colors`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-[11px] text-ink-600 font-mono">
        <span>sepi</span>
        <div className="w-3 h-3 rounded-[2px] bg-ink-700/50" />
        <div className="w-3 h-3 rounded-[2px] bg-ember-700" />
        <div className="w-3 h-3 rounded-[2px] bg-ember-600" />
        <div className="w-3 h-3 rounded-[2px] bg-ember-400" />
        <span>rajin menulis</span>
      </div>
    </div>
  );
}
