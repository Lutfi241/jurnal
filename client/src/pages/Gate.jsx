import { useEffect, useState } from "react";
import { api, setToken } from "../api/client";

export default function Gate({ onAuth }) {
  const [needsSetup, setNeedsSetup] = useState(null);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.authStatus().then((s) => setNeedsSetup(!s.setup)).catch(() => setNeedsSetup(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (needsSetup) {
        if (pin !== confirmPin) throw new Error("Konfirmasi PIN tidak cocok.");
        const { token } = await api.setupPin(pin);
        setToken(token);
      } else {
        const { token } = await api.login(pin);
        setToken(token);
      }
      onAuth();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (needsSetup === null) return null;

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="font-display text-3xl text-paper-100 text-center mb-1">Ledger</p>
        <p className="text-center text-ink-600 text-sm mb-8 font-mono">
          {needsSetup ? "buat PIN untuk mengunci jurnal" : "masukkan PIN untuk masuk"}
        </p>

        <form onSubmit={handleSubmit} className="bg-ink-900 border border-ink-700 rounded p-6 flex flex-col gap-4">
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            className="bg-ink-800 border border-ink-700 rounded px-4 py-3 text-center tracking-[0.3em] text-paper-100 outline-none focus:border-ember-500"
          />
          {needsSetup && (
            <input
              type="password"
              inputMode="numeric"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Ulangi PIN"
              className="bg-ink-800 border border-ink-700 rounded px-4 py-3 text-center tracking-[0.3em] text-paper-100 outline-none focus:border-ember-500"
            />
          )}
          {error && <p className="text-ember-400 text-xs text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !pin}
            className="bg-ember-500 hover:bg-ember-600 disabled:opacity-50 text-ink-950 font-medium rounded py-3 transition-colors"
          >
            {needsSetup ? "Buat & Masuk" : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
