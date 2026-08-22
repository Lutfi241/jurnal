import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dasbor", icon: "◆" },
  { to: "/tulis", label: "Tulis Baru", icon: "✎" },
  { to: "/entri", label: "Semua Entri", icon: "≡" },
  { to: "/kalender", label: "Kalender", icon: "▦" },
  { to: "/statistik", label: "Statistik", icon: "▲" },
  { to: "/pengaturan", label: "Pengaturan", icon: "⚙" },
];

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-ink-700 bg-ink-900 px-5 py-8 flex flex-col">
      <div className="mb-10 px-1">
        <p className="font-display text-2xl text-paper-100 tracking-tight">Ledger</p>
        <p className="font-mono text-[11px] text-ink-600 tracking-widest uppercase mt-0.5">
          jurnal pribadi
        </p>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
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
  );
}
