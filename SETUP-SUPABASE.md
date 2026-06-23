# Setup Supabase — Apotek Etiket App

Kode app sudah siap terhubung ke Supabase. Ikuti langkah ini supaya backend-nya aktif.

## 1. Buat project Supabase
1. Buka https://supabase.com → Sign in → **New project**.
2. Isi nama project, password database (simpan baik-baik), pilih region terdekat (mis. Singapore).
3. Tunggu sampai project selesai di-provision (1–2 menit).

## 2. Jalankan schema SQL
1. Di dashboard project, buka menu **SQL Editor** → **New query**.
2. Buka file `supabase/schema.sql` dari project ini, copy semua isinya.
3. Paste ke SQL Editor → klik **Run**.
4. Pastikan muncul "Success" tanpa error. Ini akan membuat:
   - tabel `etiket` (riwayat etiket yang sudah dicetak)
   - tabel `apotek_settings` (profil apotek, 1 baris `id='default'`)
   - RLS policy supaya anon key bisa baca/tulis (cocok untuk app 1 apotek tanpa login)

## 3. Ambil URL & anon key
1. Buka menu **Project Settings** (ikon gear) → **API**.
2. Copy nilai **Project URL** dan **anon public** key.

## 4. Isi file .env
1. Copy `.env.example` menjadi `.env` di root project.
2. Isi:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
3. Simpan. Jangan commit `.env` ke git (sudah biasanya ada di `.gitignore` Vite default, tapi cek lagi).

## 5. Jalankan & cek koneksi
```bash
npm install
npm run dev
```
- Buka app, isi form etiket, klik cetak/print → cek di Supabase **Table Editor > etiket**, baris baru harus muncul.
- Buka halaman Settings, ubah nama apotek, simpan → cek **Table Editor > apotek_settings**, baris `default` harus terupdate.
- Kalau env var kosong/salah, app tetap jalan normal tapi cuma local-only (data tidak ke-sync ke cloud) — tidak akan crash, karena kode sudah ada fallback-nya.

## 6. (Opsional) Deploy
Kalau nanti deploy ke Vercel/Netlify/dll, masukkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` yang sama ke **Environment Variables** di platform hosting tersebut.

## Catatan keamanan
RLS dibuka untuk role `anon` (siapapun yang punya anon key bisa baca/tulis/hapus semua baris). Ini wajar untuk app internal 1 apotek tanpa sistem login. Kalau nanti mau multi-apotek atau publik dengan akun masing-masing, perlu tambah Supabase Auth + ubah policy RLS supaya tiap user hanya bisa akses data miliknya sendiri (saya bisa bantu kalau sudah sampai tahap itu).
