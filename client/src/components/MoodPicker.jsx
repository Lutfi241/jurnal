const moods = [
  { score: 1, label: "Berat" },
  { score: 2, label: "Kurang" },
  { score: 3, label: "Biasa" },
  { score: 4, label: "Baik" },
  { score: 5, label: "Ringan" },
];

export default function MoodPicker({ value, onChange }) {
  return (
    <div className="flex gap-1.5 sm:gap-2">
      {moods.map((m) => (
        <button
          type="button"
          key={m.score}
          onClick={() => onChange(value === m.score ? null : m.score)}
          className={`flex-1 py-2 sm:py-2.5 px-0.5 rounded border text-[10px] sm:text-xs font-medium transition-colors ${
            value === m.score
              ? "border-ember-500 bg-ember-500/15 text-ember-400"
              : "border-ink-700 text-paper-200/60 hover:border-ink-600"
          }`}
        >
          <div className="font-mono text-sm mb-0.5">{m.score}</div>
          {m.label}
        </button>
      ))}
    </div>
  );
}
