import { NextResponse } from 'next/server';
import { dispatchRealSms } from '@/lib/telephonyService';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, message, referenceId } = body;

    if (!to || !message) {
      return NextResponse.json({ error: 'Recipient phone ("to") and "message" are required' }, { status: 400 });
    }

    const result = await dispatchRealSms({
      to,
      message,
      referenceId: referenceId || `SMS-${Date.now()}`,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'SMS dispatch error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
