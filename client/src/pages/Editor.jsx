import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import MoodPicker from "../components/MoodPicker";
import TagInput from "../components/TagInput";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(null);
  const [tags, setTags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing) {
      api.getEntry(id).then((e) => {
        setTitle(e.title);
        setContent(e.content);
        setMood(e.mood_score);
        setTags(e.tags);
      });
    }
  }, [id, isEditing]);

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const payload = { title, content, mood_score: mood, tags };
      if (isEditing) {
        await api.updateEntry(id, payload);
      } else {
        const created = await api.createEntry(payload);
        navigate(`/tulis/${created.id}`, { replace: true });
      }
      setSavedAt(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Hapus entri ini? Tindakan ini tidak bisa dibatalkan.")) return;
    await api.deleteEntry(id);
    navigate("/entri");
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
        <h1 className="font-display text-xl sm:text-2xl text-paper-100">
          {isEditing ? "Sunting entri" : "Entri baru"}
        </h1>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-ink-600 text-xs font-mono">
              tersimpan {savedAt.toLocaleTimeString("id-ID")}
            </span>
          )}
          {isEditing && (
            <button
              onClick={handleDelete}
              className="text-dusk-400 hover:text-ember-400 text-xs font-mono"
            >
              hapus
            </button>
          )}
        </div>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Judul entri..."
        className="w-full bg-transparent font-display text-2xl text-paper-100 placeholder:text-ink-600 outline-none mb-4 pb-3 border-b border-ink-700"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Tulis apa saja yang ada di pikiran Anda hari ini..."
        rows={12}
        className="w-full bg-transparent text-paper-200 placeholder:text-ink-600 outline-none resize-none leading-relaxed mb-6"
      />

      <div className="mb-5">
        <p className="text-ink-600 text-xs font-mono uppercase tracking-wide mb-2">Mood hari ini</p>
        <MoodPicker value={mood} onChange={setMood} />
      </div>

      <div className="mb-8">
        <p className="text-ink-600 text-xs font-mono uppercase tracking-wide mb-2">Tag</p>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      {error && <p className="text-ember-400 text-sm mb-4">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-ember-500 hover:bg-ember-600 disabled:opacity-50 text-ink-950 font-medium rounded px-6 py-2.5 transition-colors"
      >
        {saving ? "Menyimpan..." : "Simpan entri"}
      </button>
    </div>
  );
}
