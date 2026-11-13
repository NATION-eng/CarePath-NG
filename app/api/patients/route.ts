import { NextResponse } from 'next/server';
import { PatientProfile } from '@/lib/types';
import { serverDb } from '@/lib/serverDb';

// GET all registered patients
export async function GET() {
  try {
    const patients = serverDb.patients.getAll();
    return NextResponse.json({ success: true, count: patients.length, patients });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error retrieving patients';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Register a new patient
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, relationship, dateOfBirth, stageInfo, phone, proxyName, proxyPhone, proxyRelationship } = body;

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and care category are required' }, { status: 400 });
    }

    const categoryPrefix = category === 'maternal' ? 'M' : category === 'immunisation' ? 'C' : 'A';
    const patientCode = `CP-${categoryPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPatient: PatientProfile = {
      id: `pat-${Date.now()}`,
      code: patientCode,
      name,
      relationship: relationship || 'self',
      category,
      categoryLabel:
        category === 'maternal'
          ? 'Maternal & Antenatal Care'
          : category === 'immunisation'
          ? 'National Immunisation (NPHCDA)'
          : category === 'postnatal'
          ? 'Postnatal & Neonatal Care'
          : 'General & Chronic Health',
      stageInfo: stageInfo || 'Active Care',
      avatarInitials: name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      phoneOwnedByPatient: !!phone,
      registeredPhone: phone || undefined,
      notificationContact: {
        name: proxyName || name,
        phone: proxyPhone || phone || '+234 800 000 0000',
        relationship: proxyRelationship || (phone ? 'Self' : 'Caregiver Proxy'),
      },
    };

    // Save to server database
    serverDb.patients.insert(newPatient);

    // Auto-generate initial care event
    const initialEvent = {
      id: `evt-${Date.now()}`,
      patientId: newPatient.id,
      title:
        category === 'immunisation'
          ? 'At-Birth / 6-Week Intake Assessment'
          : category === 'maternal'
          ? 'Antenatal Registration & Initial Scan'
          : 'Initial Clinical Assessment',
      subtitle: stageInfo || 'Initial Clinical Intake',
      facilityName: 'Garki Primary Healthcare Centre',
      facilityAddress: 'Area 10, Garki, Abuja FCT',
      date: 'Next Clinic Session',
      time: '09:00 AM',
      duePeriod: 'Intake Milestone',
      status: 'scheduled' as const,
      category,
      instructions: ['Bring physical hospital record card', 'Arrive between 8:30 AM and 10:30 AM'],
      clinicianName: 'Nurse Blessing Aliyu',
      clinicianRole: 'Senior CHO',
      pidginAudioText: `Good day. Na reminder say your registration for Garki PHC don complete. Your next clinic date na Next Clinic Session by 9 in the morning.`,
      englishAudioText: `Good day. Your registration at Garki Primary Healthcare Centre is complete. Your next clinic session is scheduled for 09:00 AM.`,
      reminderSent: true,
      reminderDeliveryStatus: 'delivered' as const,
    };

    serverDb.events.insert(initialEvent);

    return NextResponse.json({ success: true, patient: newPatient, initialEvent }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: Delete patient and cascade delete all their events & SMS
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Patient ID query parameter required (?id=...)' }, { status: 400 });
    }

    const success = serverDb.patients.delete(id);
    if (!success) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Patient and all associated records permanently purged.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Deletion error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
