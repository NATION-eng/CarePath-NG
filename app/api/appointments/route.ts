import { NextResponse } from 'next/server';
import { CareEvent } from '@/lib/types';
import { dispatchRealSms } from '@/lib/telephonyService';
import { serverDb } from '@/lib/serverDb';

export const dynamic = 'force-dynamic';

// GET all appointments or filter by patientId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    const events = patientId
      ? serverDb.events.getByPatientId(patientId)
      : serverDb.events.getAll();

    return NextResponse.json({ success: true, count: events.length, events });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error fetching appointments';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Schedule a new appointment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      patientId,
      patientName,
      recipientPhone,
      title,
      subtitle,
      facilityName,
      facilityAddress,
      date,
      time,
      duePeriod,
      category,
      instructions,
      clinicianName,
      clinicianRole,
      vaccines,
    } = body;

    if (!patientId || !title || !date || !facilityName) {
      return NextResponse.json({ error: 'Missing required appointment fields' }, { status: 400 });
    }

    const eventId = `evt-${Date.now()}`;
    const newEvent: CareEvent = {
      id: eventId,
      patientId,
      title,
      subtitle: subtitle || 'Scheduled Clinical Review',
      facilityName,
      facilityAddress: facilityAddress || 'Primary Healthcare Facility',
      date,
      time: time || '09:00 AM',
      duePeriod: duePeriod || 'Scheduled Visit',
      status: 'scheduled',
      category: category || 'general',
      instructions: instructions && instructions.length > 0 ? instructions : ['Bring hospital record card', 'Arrive 15 minutes before scheduled session'],
      clinicianName: clinicianName || 'Attending Clinical Officer',
      clinicianRole: clinicianRole || 'Community Health Officer (CHO)',
      vaccines: vaccines || [],
      pidginAudioText: `Good day. Na reminder say your appointment for ${facilityName} dey come up on ${date} by ${time || '9 in the morning'}. Carry your hospital card come. If you go fit come, reply 1. If you wan change date, reply 2. Thank you!`,
      englishAudioText: `Good day. This is a reminder for your healthcare appointment at ${facilityName} scheduled for ${date} at ${time || '09:00 AM'}. Please bring your hospital card. Reply 1 to confirm attendance or 2 to request rescheduling.`,
      reminderSent: true,
      reminderDeliveryStatus: 'delivered',
      lastNotificationSnippet: `CarePath: Appointment scheduled at ${facilityName} on ${date} at ${time || '09:00 AM'}. Reply 1 to Confirm.`,
    };

    // Save event to server database
    serverDb.events.insert(newEvent);

    // Save outbound SMS to database & dispatch
    let smsDispatchResult = null;
    if (recipientPhone) {
      const smsMessageText = `CarePath: Scheduled visit for ${patientName || 'patient'} at ${facilityName} on ${date} at ${time || '09:00 AM'}. Reply 1 to Confirm, 2 to Reschedule.`;
      
      serverDb.sms.insert({
        id: `sms-${Date.now()}`,
        sender: 'CAREPATH-NG',
        recipientPhone,
        recipientName: patientName || 'Patient',
        patientName: patientName || 'Patient',
        messageText: smsMessageText,
        timestamp: 'Just now',
        deliveryStatus: 'delivered',
        discreet: true,
        referenceCode: eventId,
      });

      smsDispatchResult = await dispatchRealSms({
        to: recipientPhone,
        message: smsMessageText,
        referenceId: eventId,
      });
    }

    return NextResponse.json({
      success: true,
      event: newEvent,
      smsDispatch: smsDispatchResult,
    }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH: Update status, confirm, reschedule, or complete appointment
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, date, time } = body;

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const updates: Partial<CareEvent> = {};
    if (status) updates.status = status;
    if (date) updates.date = date;
    if (time) updates.time = time;

    const updated = serverDb.events.update(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, event: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Update error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: Delete appointment
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 });
    }

    const success = serverDb.events.delete(id);
    return NextResponse.json({ success });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Delete error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
