import { NextResponse } from 'next/server';
import { CareEvent } from '@/lib/types';
import { dispatchRealSms } from '@/lib/telephonyService';

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

    // If a phone number is provided, dispatch real SMS
    let smsDispatchResult = null;
    if (recipientPhone) {
      smsDispatchResult = await dispatchRealSms({
        to: recipientPhone,
        message: `CarePath: Scheduled visit for ${patientName || 'patient'} at ${facilityName} on ${date} at ${time || '09:00 AM'}. Reply 1 to Confirm, 2 to Reschedule.`,
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
