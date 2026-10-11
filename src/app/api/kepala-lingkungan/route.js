import { NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDb();
    const sql = getDb();

    const data = await sql`SELECT * FROM kepala_lingkungan ORDER BY nomor_lingkungan ASC`;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch kepala lingkungan error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kepala lingkungan' },
      { status: 500 }
    );
  }
}
