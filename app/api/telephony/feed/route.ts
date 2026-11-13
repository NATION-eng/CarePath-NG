import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';

export async function GET() {
  try {
    const sms = serverDb.sms.getAll();
    return NextResponse.json({ success: true, count: sms.length, sms });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error fetching SMS feed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
