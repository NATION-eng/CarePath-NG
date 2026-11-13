import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/serverDb';

export async function GET() {
  try {
    const logs = serverDb.audit.getAll();
    return NextResponse.json({ success: true, count: logs.length, logs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error fetching audit logs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
