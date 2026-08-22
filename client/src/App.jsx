import { useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
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

export default function App() {
  const [authed, setAuthed] = useState(hasToken());

  if (!authed) {
    return <Gate onAuth={() => setAuthed(true)} />;
  }

  return (
    <HashRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 px-10 py-8 overflow-y-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                clearToken();
                setAuthed(false);
              }}
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
    </HashRouter>
  );
}
