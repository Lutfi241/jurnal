const express = require("express");
const crypto = require("crypto");
const db = require("./db");
const { isSetup, setPin, verifyPin, issueToken, authMiddleware } = require("./auth");

const router = express.Router();

// ---------- Auth ----------
router.get("/auth/status", (req, res) => {
  res.json({ setup: isSetup() });
});

router.post("/auth/setup", (req, res) => {
  const { pin } = req.body;
  if (isSetup()) return res.status(400).json({ error: "PIN sudah pernah dibuat." });
  if (!pin || String(pin).length < 4) {
    return res.status(400).json({ error: "PIN minimal 4 digit/karakter." });
  }
  setPin(String(pin));
  res.json({ token: issueToken() });
});

router.post("/auth/login", (req, res) => {
  const { pin } = req.body;
  if (!isSetup()) return res.status(400).json({ error: "Belum ada PIN. Buat PIN dulu." });
  if (!verifyPin(String(pin || ""))) {
    return res.status(401).json({ error: "PIN salah." });
  }
  res.json({ token: issueToken() });
});

router.post("/auth/change-pin", authMiddleware, (req, res) => {
  const { currentPin, newPin } = req.body;
  if (!verifyPin(String(currentPin || ""))) {
    return res.status(401).json({ error: "PIN saat ini salah." });
  }
  if (!newPin || String(newPin).length < 4) {
    return res.status(400).json({ error: "PIN baru minimal 4 digit/karakter." });
  }
  setPin(String(newPin));
  res.json({ ok: true });
});

// ---------- Entries (protected) ----------
router.use("/entries", authMiddleware);

function rowToEntry(row) {
  return {
    ...row,
    mood_tags: JSON.parse(row.mood_tags || "[]"),
    tags: JSON.parse(row.tags || "[]"),
  };
}

router.get("/entries", (req, res) => {
  const { q, tag, from, to, mood } = req.query;
  let sql = "SELECT * FROM entries WHERE 1=1";
  const params = [];

  if (q) {
    sql += " AND (title LIKE ? OR content LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }
  if (tag) {
    sql += " AND tags LIKE ?";
    params.push(`%"${tag}"%`);
  }
  if (mood) {
    sql += " AND mood_score = ?";
    params.push(Number(mood));
  }
  if (from) {
    sql += " AND created_at >= ?";
    params.push(from);
  }
  if (to) {
    sql += " AND created_at <= ?";
    params.push(to);
  }
  sql += " ORDER BY created_at DESC";

  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(rowToEntry));
});

router.get("/entries/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM entries WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Entri tidak ditemukan." });
  res.json(rowToEntry(row));
});

router.post("/entries", (req, res) => {
  const { title, content, mood_score, mood_tags, tags, created_at } = req.body;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const createdAt = created_at || now;

  db.prepare(
    `INSERT INTO entries (id, title, content, mood_score, mood_tags, tags, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    title || "",
    content || "",
    mood_score ?? null,
    JSON.stringify(mood_tags || []),
    JSON.stringify(tags || []),
    createdAt,
    now
  );

  const row = db.prepare("SELECT * FROM entries WHERE id = ?").get(id);
  res.status(201).json(rowToEntry(row));
});

router.put("/entries/:id", (req, res) => {
  const existing = db.prepare("SELECT * FROM entries WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Entri tidak ditemukan." });

  const { title, content, mood_score, mood_tags, tags, created_at } = req.body;
  const now = new Date().toISOString();

  db.prepare(
    `UPDATE entries SET title = ?, content = ?, mood_score = ?, mood_tags = ?, tags = ?, created_at = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    title ?? existing.title,
    content ?? existing.content,
    mood_score !== undefined ? mood_score : existing.mood_score,
    JSON.stringify(mood_tags ?? JSON.parse(existing.mood_tags || "[]")),
    JSON.stringify(tags ?? JSON.parse(existing.tags || "[]")),
    created_at || existing.created_at,
    now,
    req.params.id
  );

  const row = db.prepare("SELECT * FROM entries WHERE id = ?").get(req.params.id);
  res.json(rowToEntry(row));
});

router.delete("/entries/:id", (req, res) => {
  const info = db.prepare("DELETE FROM entries WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Entri tidak ditemukan." });
  res.json({ ok: true });
});

// ---------- Stats ----------
router.get("/stats", authMiddleware, (req, res) => {
  const rows = db.prepare("SELECT * FROM entries").all();
  const entries = rows.map(rowToEntry);

  const byDate = {};
  const moodByDate = {};
  const tagCount = {};

  for (const e of entries) {
    const day = e.created_at.slice(0, 10);
    byDate[day] = (byDate[day] || 0) + 1;
    if (e.mood_score) {
      if (!moodByDate[day]) moodByDate[day] = [];
      moodByDate[day].push(e.mood_score);
    }
    for (const t of e.tags) tagCount[t] = (tagCount[t] || 0) + 1;
  }

  const moodTrend = Object.entries(moodByDate)
    .map(([date, scores]) => ({
      date,
      avg: scores.reduce((a, b) => a + b, 0) / scores.length,
    }))
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  const topTags = Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Streak calculation
  const daysWithEntry = new Set(Object.keys(byDate));
  let streak = 0;
  let cursor = new Date();
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (daysWithEntry.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  res.json({
    totalEntries: entries.length,
    heatmap: byDate,
    moodTrend,
    topTags,
    streak,
  });
});

// ---------- Export ----------
router.get("/export", authMiddleware, (req, res) => {
  const rows = db.prepare("SELECT * FROM entries ORDER BY created_at ASC").all();
  res.json(rows.map(rowToEntry));
});

module.exports = router;
