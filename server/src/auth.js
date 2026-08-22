const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

function getPinHash() {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'pin_hash'").get();
  return row ? row.value : null;
}

function isSetup() {
  return !!getPinHash();
}

function setPin(pin) {
  const hash = bcrypt.hashSync(pin, 10);
  db.prepare(
    "INSERT INTO settings (key, value) VALUES ('pin_hash', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  ).run(hash);
}

function verifyPin(pin) {
  const hash = getPinHash();
  if (!hash) return false;
  return bcrypt.compareSync(pin, hash);
}

function issueToken() {
  return jwt.sign({ scope: "journal" }, SECRET, { expiresIn: "30d" });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Tidak ada token akses." });
  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Sesi tidak valid, silakan masuk kembali." });
  }
}

module.exports = { isSetup, setPin, verifyPin, issueToken, authMiddleware };
