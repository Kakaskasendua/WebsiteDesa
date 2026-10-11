import { neon } from '@neondatabase/serverless';

// Singleton sql instance
let sqlInstance = null;

export function getDb() {
  if (!sqlInstance) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        'DATABASE_URL tidak ditemukan di environment variables. ' +
        'Silakan buat database Neon di https://neon.tech dan tambahkan connection string ke .env.local'
      );
    }
    sqlInstance = neon(url);
  }
  return sqlInstance;
}

// Initialize database tables
export async function initDb() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      nama VARCHAR(100) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS pengumuman (
      id SERIAL PRIMARY KEY,
      judul VARCHAR(200) NOT NULL,
      isi TEXT NOT NULL,
      is_pinned BOOLEAN DEFAULT FALSE,
      gambar_url TEXT,
      file_url TEXT,
      file_nama TEXT,
      created_by VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Migrasi untuk database yang sudah ada (tambah kolom baru jika belum ada)
  await sql`ALTER TABLE pengumuman ADD COLUMN IF NOT EXISTS gambar_url TEXT`;
  await sql`ALTER TABLE pengumuman ADD COLUMN IF NOT EXISTS file_url TEXT`;
  await sql`ALTER TABLE pengumuman ADD COLUMN IF NOT EXISTS file_nama TEXT`;

  await sql`
    CREATE TABLE IF NOT EXISTS laporan (
      id SERIAL PRIMARY KEY,
      nama_pelapor VARCHAR(100) NOT NULL,
      no_telepon VARCHAR(20),
      email VARCHAR(100),
      alamat TEXT,
      kategori VARCHAR(50) NOT NULL,
      judul VARCHAR(200) NOT NULL,
      deskripsi TEXT NOT NULL,
      lokasi_kejadian TEXT,
      status VARCHAR(20) DEFAULT 'Diterima',
      catatan_admin TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS galeri (
      id SERIAL PRIMARY KEY,
      judul VARCHAR(200) NOT NULL,
      deskripsi TEXT,
      gambar_url TEXT NOT NULL,
      created_by VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS aparatur (
      id SERIAL PRIMARY KEY,
      kategori VARCHAR(50) NOT NULL, -- lurah, sekretariat, kasie
      jabatan VARCHAR(100) NOT NULL,
      nama VARCHAR(100) NOT NULL,
      nip VARCHAR(50),
      urutan INT NOT NULL,
      jabatan_divisi VARCHAR(100),
      is_kepala BOOLEAN NOT NULL DEFAULT FALSE
    )
  `;

  // Migrasi kolom struktur untuk database Neon yang sudah dibuat sebelumnya.
  await sql`ALTER TABLE aparatur ADD COLUMN IF NOT EXISTS jabatan_divisi VARCHAR(100)`;
  await sql`ALTER TABLE aparatur ADD COLUMN IF NOT EXISTS is_kepala BOOLEAN NOT NULL DEFAULT FALSE`;

  // Seed/sinkronisasi data struktur awal. Setelah 15 ID target tersedia,
  // perubahan nama melalui halaman admin tidak ditimpa lagi.
  const targetIds = [47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61];
  const targetCount = await sql`
    SELECT COUNT(*) FROM aparatur
    WHERE id = ANY(${targetIds}::int[])
  `;
  const aparaturCount = await sql`SELECT COUNT(*) FROM aparatur`;

  if (parseInt(targetCount[0].count) !== targetIds.length || parseInt(aparaturCount[0].count) !== targetIds.length) {
    const defaultData = [
      { id: 1, kategori: 'lurah', jabatan: 'Lurah Kakaskasen Dua', nama: 'FENDY M. MONGDONG', nip: '', urutan: 1, jabatanDivisi: 'Lurah', isKepala: true },
      { id: 2, kategori: 'sekretariat', jabatan: 'Staf Kesekretariatan', nama: 'MEILANI M. TEROK', nip: '', urutan: 2, jabatanDivisi: 'Kesekretariatan', isKepala: false },
      { id: 3, kategori: 'sekretariat', jabatan: 'Staf Kesekretariatan', nama: 'ARKELINA HUTRI RUNTULALO', nip: '', urutan: 3, jabatanDivisi: 'Kesekretariatan', isKepala: false },
      { id: 4, kategori: 'sekretariat', jabatan: 'Staf Kesekretariatan', nama: 'ARKELINA ANGREANI HUTRI RUNTULALO', nip: '', urutan: 4, jabatanDivisi: 'Kesekretariatan', isKepala: false },
      { id: 5, kategori: 'sekretariat', jabatan: 'Staf Kesekretariatan', nama: 'MEINNY REZKY NOFRIKE RENGKUNG', nip: '', urutan: 5, jabatanDivisi: 'Kesekretariatan', isKepala: false },
      { id: 6, kategori: 'kasie', jabatan: 'Kasie Pemerintah dan Trantib', nama: 'NOVIE N. LENAK', nip: '', urutan: 6, jabatanDivisi: 'Kasie Pemerintah dan Trantib', isKepala: true },
      { id: 7, kategori: 'kasie', jabatan: 'Anggota', nama: 'DENNY DECHRI CHARLIS RUNTUWENE', nip: '', urutan: 7, jabatanDivisi: 'Kasie Pemerintah dan Trantib', isKepala: false },
      { id: 8, kategori: 'kasie', jabatan: 'Anggota', nama: 'ALBERT ODY PITOY', nip: '', urutan: 8, jabatanDivisi: 'Kasie Pemerintah dan Trantib', isKepala: false },
      { id: 9, kategori: 'kasie', jabatan: 'Kasie Pembangunan dan Keuangan', nama: 'STEVY TUMBELAKA', nip: '', urutan: 9, jabatanDivisi: 'Kasie Pembangunan dan Keuangan', isKepala: true },
      { id: 10, kategori: 'kasie', jabatan: 'Anggota', nama: 'ALVIJAN A.H TULUS', nip: '', urutan: 10, jabatanDivisi: 'Kasie Pembangunan dan Keuangan', isKepala: false },
      { id: 11, kategori: 'kasie', jabatan: 'Anggota', nama: 'ROLANDO ROLENS LUMENTA', nip: '', urutan: 11, jabatanDivisi: 'Kasie Pembangunan dan Keuangan', isKepala: false },
      { id: 12, kategori: 'kasie', jabatan: 'Anggota', nama: 'SATRIA DAVID MANDAGI', nip: '', urutan: 12, jabatanDivisi: 'Kasie Pembangunan dan Keuangan', isKepala: false },
      { id: 13, kategori: 'kasie', jabatan: 'Kasie Kesejahteraan Rakyat', nama: 'WENLY C. C. PONGAJOW', nip: '', urutan: 13, jabatanDivisi: 'Kasie Kesejahteraan Rakyat', isKepala: true },
      { id: 14, kategori: 'kasie', jabatan: 'Anggota', nama: 'VERONIKA STEINY PALENDENG', nip: '', urutan: 14, jabatanDivisi: 'Kasie Kesejahteraan Rakyat', isKepala: false },
      { id: 15, kategori: 'kasie', jabatan: 'Anggota', nama: 'BASILIUS FENLI ANGOW', nip: '', urutan: 15, jabatanDivisi: 'Kasie Kesejahteraan Rakyat', isKepala: false }
    ];

    await sql`DELETE FROM aparatur`;
    for (const item of defaultData) {
      await sql`
        INSERT INTO aparatur
          (id, kategori, jabatan, nama, nip, urutan, jabatan_divisi, is_kepala)
        VALUES
          (${item.id}, ${item.kategori}, ${item.jabatan}, ${item.nama}, ${item.nip},
           ${item.urutan}, ${item.jabatanDivisi}, ${item.isKepala})
      `;
    }
    await sql`SELECT setval(pg_get_serial_sequence('aparatur', 'id'), 61, true)`;
  }

  // ── Kepala Lingkungan ──────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS kepala_lingkungan (
      id SERIAL PRIMARY KEY,
      nomor_lingkungan INT UNIQUE NOT NULL,
      nama VARCHAR(100) NOT NULL DEFAULT '',
      keterangan VARCHAR(200) DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Migrasi kolom keterangan untuk database yang sudah ada
  await sql`ALTER TABLE kepala_lingkungan ADD COLUMN IF NOT EXISTS keterangan VARCHAR(200) DEFAULT ''`;

  // Seed data lingkungan 1-13 jika belum ada
  const klCount = await sql`SELECT COUNT(*) FROM kepala_lingkungan`;
  if (parseInt(klCount[0].count) === 0) {
    for (let i = 1; i <= 13; i++) {
      await sql`
        INSERT INTO kepala_lingkungan (nomor_lingkungan, nama)
        VALUES (${i}, '')
        ON CONFLICT (nomor_lingkungan) DO NOTHING
      `;
    }
  }

  return true;
}
