import { NextResponse } from 'next/server';
import { PatientProfile } from '@/lib/types';

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
      stageInfo: stageInfo || 'Initial Registration',
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

    return NextResponse.json({ success: true, patient: newPatient }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
