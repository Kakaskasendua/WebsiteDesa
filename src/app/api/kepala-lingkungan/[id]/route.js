import { NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { nama, keterangan } = await request.json();

    await initDb();
    const sql = getDb();

    const result = await sql`
      UPDATE kepala_lingkungan
      SET nama = ${nama || ''}, keterangan = ${keterangan || ''}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Update kepala lingkungan error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data' },
      { status: 500 }
    );
  }
}