import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function ensureSettingsTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS pengaturan (
      kunci VARCHAR(50) PRIMARY KEY,
      nilai TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    const sql = getDb();
    await ensureSettingsTable(sql);
    const rows = await sql`SELECT kunci, nilai FROM pengaturan`;
    const settings = {};
    for (const row of rows) {
      settings[row.kunci] = row.nilai;
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Fetch pengaturan error:', error);
    return NextResponse.json({ bagan_struktur_url: '/struktur-kelurahan.png' });
  }
}

export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { kunci, nilai } = await request.json();
    if (!kunci || nilai === undefined) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const sql = getDb();
    await ensureSettingsTable(sql);

    await sql`
      INSERT INTO pengaturan (kunci, nilai, updated_at)
      VALUES (${kunci}, ${nilai}, NOW())
      ON CONFLICT (kunci) DO UPDATE
        SET nilai = EXCLUDED.nilai, updated_at = NOW()
    `;

    return NextResponse.json({ success: true, kunci, nilai });
  } catch (error) {
    console.error('Update pengaturan error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui pengaturan' },
      { status: 500 }
    );
  }
}
