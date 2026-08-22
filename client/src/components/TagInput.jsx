import { useState } from "react";

export default function TagInput({ tags = [], onChange, placeholder = "Tambah tag, Enter untuk simpan" }) {
  const [draft, setDraft] = useState("");

  function addTag() {
    const t = draft.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setDraft("");
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.map((t) => (
        <span
          key={t}
          className="flex items-center gap-1.5 bg-ink-800 border border-ink-700 rounded px-2.5 py-1 text-xs text-paper-200"
        >
          #{t}
          <button
            type="button"
            onClick={() => onChange(tags.filter((x) => x !== t))}
            className="text-ink-600 hover:text-ember-400"
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag();
          }
        }}
        onBlur={addTag}
        placeholder={placeholder}
        className="bg-transparent text-xs text-paper-100 placeholder:text-ink-600 outline-none py-1 min-w-[140px]"
      />
    </div>
  );
}
