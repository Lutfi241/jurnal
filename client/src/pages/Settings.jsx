import { useState } from "react";
import { api } from "../api/client";

export default function Settings() {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function handleChangePin(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      await api.changePin(currentPin, newPin);
      setMsg("PIN berhasil diganti.");
      setCurrentPin("");
      setNewPin("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleExport() {
    const data = await api.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jurnal-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-md">
      <h1 className="font-display text-2xl text-paper-100 mb-6">Pengaturan</h1>

      <div className="bg-ink-900 border border-ink-700 rounded p-5 mb-6">
        <p className="text-ink-600 text-xs font-mono uppercase tracking-wide mb-4">Ganti PIN</p>
        <form onSubmit={handleChangePin} className="flex flex-col gap-3">
          <input
            type="password"
            value={currentPin}
            onChange={(e) => setCurrentPin(e.target.value)}
            placeholder="PIN saat ini"
            className="bg-ink-800 border border-ink-700 rounded px-3 py-2 text-paper-100 outline-none focus:border-ember-500"
          />
          <input
            type="password"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            placeholder="PIN baru"
            className="bg-ink-800 border border-ink-700 rounded px-3 py-2 text-paper-100 outline-none focus:border-ember-500"
          />
          {msg && <p className="text-sage-400 text-xs">{msg}</p>}
          {error && <p className="text-ember-400 text-xs">{error}</p>}
          <button
            type="submit"
            className="bg-ember-500 hover:bg-ember-600 text-ink-950 font-medium rounded py-2 transition-colors"
          >
            Simpan PIN baru
          </button>
        </form>
      </div>

      <div className="bg-ink-900 border border-ink-700 rounded p-5">
        <p className="text-ink-600 text-xs font-mono uppercase tracking-wide mb-3">Ekspor data</p>
        <p className="text-paper-200/70 text-sm mb-4">
          Unduh seluruh entri jurnal Anda sebagai file JSON untuk cadangan pribadi.
        </p>
        <button
          onClick={handleExport}
          className="border border-ink-700 hover:border-ember-500 text-paper-100 rounded px-4 py-2 text-sm transition-colors"
        >
          Unduh export (.json)
        </button>
      </div>
    </div>
  );
}
