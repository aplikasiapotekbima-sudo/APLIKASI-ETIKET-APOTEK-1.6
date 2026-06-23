-- ============================================================================
-- Schema Supabase untuk Apotek Etiket App
-- Jalankan file ini di: Supabase Dashboard > SQL Editor > New query > Run
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Tabel "etiket"  (riwayat etiket yang sudah dicetak)
-- ----------------------------------------------------------------------------
-- Catatan: nama kolom di-quote ("namaPasien", dst) supaya match persis
-- dengan key object JS yang dikirim oleh src/services/supabase.js
-- (PostgREST mencocokkan nama kolom case-sensitive sesuai apa yang dikirim).

create table if not exists public.etiket (
  id             text primary key,           -- dari Date.now().toString() di client
  "nomorResep"   text,
  tanggal        text,
  "namaPasien"   text,
  "namaDokter"   text,
  "obatList"     jsonb,                       -- array obat: [{dosis, waktu, keterangan}, ...]
  "namaApotek"   text,
  alamat         text,
  telepon        text,
  "apotekerName" text,
  synced         boolean default true,
  created_at     timestamptz default now()
);

create index if not exists etiket_created_at_idx
  on public.etiket (created_at desc);

-- ----------------------------------------------------------------------------
-- 2. Tabel "apotek_settings"  (profil apotek, selalu 1 baris dengan id='default')
-- ----------------------------------------------------------------------------

create table if not exists public.apotek_settings (
  id                       text primary key default 'default',
  "namaApotek"             text,
  alamat                   text,
  telepon                  text,
  "apotekerName"           text,
  "logoUrl"                text,              -- base64 data URL logo (opsional)
  "noEtiketAutoIncrement"  boolean default true,
  updated_at               timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 3. Trigger kecil: auto-update kolom updated_at di apotek_settings
-- ----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_apotek_settings_updated_at on public.apotek_settings;
create trigger trg_apotek_settings_updated_at
  before update on public.apotek_settings
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 4. Row Level Security
-- ----------------------------------------------------------------------------
-- App ini dipakai 1 apotek dengan anon key (tidak ada login user), jadi RLS
-- dibuka penuh untuk role anon. Ini cocok untuk app internal 1 apotek.
-- JANGAN pakai setup ini kalau nanti app dibuka untuk banyak apotek/publik
-- tanpa autentikasi user, karena siapapun yang punya anon key bisa
-- baca/ubah/hapus semua data.

alter table public.etiket enable row level security;
alter table public.apotek_settings enable row level security;

drop policy if exists "etiket_allow_anon_all" on public.etiket;
create policy "etiket_allow_anon_all"
  on public.etiket
  for all
  to anon
  using (true)
  with check (true);

drop policy if exists "apotek_settings_allow_anon_all" on public.apotek_settings;
create policy "apotek_settings_allow_anon_all"
  on public.apotek_settings
  for all
  to anon
  using (true)
  with check (true);

-- ----------------------------------------------------------------------------
-- 5. Baris default untuk apotek_settings (biar fetchApotekSettings() tidak null)
-- ----------------------------------------------------------------------------

insert into public.apotek_settings (id, "namaApotek", alamat, telepon, "apotekerName")
values (
  'default',
  'APOTEK BIMA',
  'JL. Bima, Nglaban, Sinduharjo, Ngaglik, Sleman',
  '082146129602',
  'apt. Puguh Indrasetiawan, S.Farm., M.Sc., Ph.D.'
)
on conflict (id) do nothing;
