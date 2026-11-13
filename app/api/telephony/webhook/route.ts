import { NextResponse } from 'next/server';

/**
 * Inbound Webhook for Telco Delivery Receipts (DLR) and Inbound SMS Replies
 * Accepts payloads from Termii or Twilio webhooks when patients reply '1' (Confirm) or '2' (Reschedule)
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let from = '';
    let text = '';
    let messageId = '';
    let status = '';

    if (contentType.includes('application/json')) {
      const json = await request.json();
      from = json.from || json.sender || json.phone || '';
      text = json.message || json.text || json.body || '';
      messageId = json.message_id || json.id || '';
      status = json.status || '';
    } else {
      // URL-encoded form data (Twilio format)
      const formData = await request.formData();
      from = formData.get('From')?.toString() || '';
      text = formData.get('Body')?.toString() || '';
      messageId = formData.get('MessageSid')?.toString() || '';
    }

    const trimmedText = text.trim();
    let action = 'UNHANDLED_TEXT';

    if (trimmedText === '1') {
      action = 'ATTENDANCE_CONFIRMED';
    } else if (trimmedText === '2') {
      action = 'RESCHEDULE_REQUESTED';
    }

    return NextResponse.json({
      received: true,
      sender: from,
      text: trimmedText,
      actionTaken: action,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
