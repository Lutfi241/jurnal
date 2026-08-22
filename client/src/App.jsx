import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Gate from "./pages/Gate";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Entries from "./pages/Entries";
import CalendarPage from "./pages/Calendar";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import { clearToken } from "./api/client";

function hasToken() {
  return Boolean(localStorage.getItem("jurnal_token"));
}

function AppShell({ onLock }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Tutup drawer otomatis setiap kali pindah halaman
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar hanya tampil di layar kecil */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between bg-ink-950/95 backdrop-blur border-b border-ink-700 px-4 py-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-paper-100 text-xl leading-none px-1"
            aria-label="Buka menu"
          >
            ≡
          </button>
          <p className="font-display text-lg text-paper-100">Ledger</p>
          <button
            onClick={onLock}
            className="text-ink-600 hover:text-ember-400 text-xs font-mono"
          >
            kunci
          </button>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 overflow-y-auto min-w-0">
          <div className="hidden lg:flex justify-end mb-4">
            <button
              onClick={onLock}
              className="text-ink-600 hover:text-ember-400 text-xs font-mono"
            >
              kunci jurnal
            </button>
          </div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tulis" element={<Editor />} />
            <Route path="/tulis/:id" element={<Editor />} />
            <Route path="/entri" element={<Entries />} />
            <Route path="/kalender" element={<CalendarPage />} />
            <Route path="/statistik" element={<Stats />} />
            <Route path="/pengaturan" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(hasToken());

  if (!authed) {
    return <Gate onAuth={() => setAuthed(true)} />;
  }

  return (
    <HashRouter>
      <AppShell
        onLock={() => {
          clearToken();
          setAuthed(false);
        }}
      />
    </HashRouter>
  );
}
