# Ledger — Jurnal Pribadi

Aplikasi jurnal pribadi single-user dengan mood tracker, kalender, dan statistik.

## Struktur

```
jurnal-app/
├── client/   → Frontend React + Vite + Tailwind
└── server/   → Backend Node.js + Express + SQLite
```

## Menjalankan secara lokal

### 1. Backend
```bash
cd server
cp .env.example .env     # lalu ganti JWT_SECRET dengan string acak
npm install
npm run dev               # atau: node src/index.js
```
Server berjalan di `http://localhost:4000`.

### 2. Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Buka `http://localhost:5173` di browser. Saat pertama kali dibuka, Anda akan diminta membuat PIN.

## Deploy online

**Backend** (pilih salah satu: Railway, Render, Fly.io):
- Deploy folder `server/`
- Set environment variable `JWT_SECRET` (string acak yang panjang) dan `PORT`
- Database SQLite (`data/jurnal.db`) tersimpan di disk server — pastikan platform yang dipilih punya *persistent disk/volume* (Railway & Render menyediakan ini), kalau tidak data akan hilang setiap deploy ulang.

**Frontend** (Vercel atau Netlify):
- Deploy folder `client/`
- Set environment variable `VITE_API_URL` ke URL backend yang sudah online, contoh: `https://jurnal-api.up.railway.app/api`
- Build command: `npm run build`, output folder: `dist`

## Fitur

- Tulis, edit, hapus entri jurnal
- Mood tracker (skala 1–5) per entri
- Tag bebas per entri
- Pencarian entri berdasarkan kata kunci
- Kalender bulanan — klik tanggal untuk lihat entri hari itu
- Statistik: jejak menulis (heatmap), tren mood, tag terpopuler
- Export seluruh data ke JSON untuk backup pribadi
- Proteksi akses dengan PIN (single-user, tanpa sistem akun)

## Keamanan

- PIN di-hash dengan bcrypt sebelum disimpan, tidak pernah disimpan dalam bentuk teks biasa.
- Sesi menggunakan token JWT yang tersimpan di `localStorage` browser, berlaku 30 hari.
- **Wajib ganti `JWT_SECRET`** di `.env` backend sebelum deploy ke online — jangan pakai nilai default.
- Karena ini aplikasi personal tanpa rate-limiting bawaan, disarankan tidak membagikan URL backend secara publik di tempat umum.
