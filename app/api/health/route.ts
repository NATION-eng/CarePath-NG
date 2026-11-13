import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    platform: 'CarePath NG Maternal & Child Care Continuity',
    environment: process.env.NODE_ENV || 'production',
    vercel: !!process.env.VERCEL,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    serviceWorkerReady: true,
  });
}
