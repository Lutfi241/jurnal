import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dasbor", icon: "◆" },
  { to: "/tulis", label: "Tulis Baru", icon: "✎" },
  { to: "/entri", label: "Semua Entri", icon: "≡" },
  { to: "/kalender", label: "Kalender", icon: "▦" },
  { to: "/statistik", label: "Statistik", icon: "▲" },
  { to: "/pengaturan", label: "Pengaturan", icon: "⚙" },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay gelap saat drawer terbuka di layar kecil */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 lg:w-60 shrink-0 border-r border-ink-700 bg-ink-900 px-5 py-8 flex flex-col z-40 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="mb-10 px-1 flex items-start justify-between">
          <div>
            <p className="font-display text-2xl text-paper-100 tracking-tight">Ledger</p>
            <p className="font-mono text-[11px] text-ink-600 tracking-widest uppercase mt-0.5">
              jurnal pribadi
            </p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-paper-200/60 hover:text-ember-400 text-xl leading-none px-1"
            aria-label="Tutup menu"
          >
            ×
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  isActive
                    ? "bg-ember-500/15 text-ember-400 font-medium"
                    : "text-paper-200/70 hover:bg-ink-800 hover:text-paper-100"
                }`
              }
            >
              <span className="font-mono text-xs w-4 text-center opacity-70">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-8 border-t border-ink-700/60">
          <p className="text-[11px] text-ink-600 leading-relaxed">
            Ditulis untuk diri sendiri.<br />Tidak untuk dibagikan.
          </p>
        </div>
      </aside>
    </>
  );
}
