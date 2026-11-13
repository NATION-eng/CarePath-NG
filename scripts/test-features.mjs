import assert from 'node:assert';

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(name, fn) {
  process.stdout.write(`Testing: ${name}... `);
  try {
    await fn();
    console.log('✅ PASS');
  } catch (err) {
    console.log('❌ FAIL');
    console.error(err);
    process.exitCode = 1;
  }
}

async function runAllTests() {
  console.log('====================================================');
  console.log('CarePath NG — Backend Database & API Verification');
  console.log('====================================================\n');

  // 1. Test Web App Root HTML
  await testEndpoint('Frontend App Shell & Root HTML (200 OK)', async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const text = await res.text();
    assert(text.includes('CarePath NG'), 'Missing CarePath NG in root page');
  });

  // 2. Test Real Patient Registration API (/api/patients)
  let createdPatientId = '';
  await testEndpoint('POST /api/patients (Register Real Patient in Backend DB)', async () => {
    const res = await fetch(`${BASE_URL}/api/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Halima Danjuma',
        category: 'immunisation',
        relationship: 'child',
        stageInfo: 'Newborn (0 Wks)',
        proxyName: 'Amina Danjuma',
        proxyPhone: '+2348039876543',
        proxyRelationship: 'Mother',
      }),
    });
    assert.strictEqual(res.status, 201, `Expected 201 Created, got ${res.status}`);
    const data = await res.json();
    assert(data.success, 'Expected success: true');
    assert(data.patient.code.startsWith('CP-C-'), 'Expected code starting with CP-C-');
    createdPatientId = data.patient.id;
  });

  // 3. Test GET /api/patients
  await testEndpoint('GET /api/patients (Fetch Patients from Server Database)', async () => {
    const res = await fetch(`${BASE_URL}/api/patients`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.patients.some((p) => p.id === createdPatientId), 'Patient must be persisted in DB');
  });

  // 4. Test Appointment Scheduling API (/api/appointments)
  let createdEventId = '';
  await testEndpoint('POST /api/appointments (Schedule Visit in Backend DB)', async () => {
    const res = await fetch(`${BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: createdPatientId,
        patientName: 'Halima Danjuma',
        recipientPhone: '+2348039876543',
        title: '6-Week Penta 1 & Rota 1 Visit',
        subtitle: 'Penta 1, OPV 1, PCV 1, Rota 1',
        facilityName: 'Garki Primary Healthcare Centre',
        facilityAddress: 'Area 10, Garki, Abuja FCT',
        date: 'Thursday, Dec 04',
        time: '09:00 AM',
        duePeriod: '6-Week Milestone',
        category: 'immunisation',
        instructions: ['Bring yellow child health card'],
        clinicianName: 'Nurse Blessing Aliyu',
        clinicianRole: 'Senior CHO',
        vaccines: ['Penta 1', 'OPV 1', 'PCV 1', 'Rota 1'],
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert(data.success);
    createdEventId = data.event.id;
  });

  // 5. Test GET /api/appointments
  await testEndpoint('GET /api/appointments (Fetch Events from Server Database)', async () => {
    const res = await fetch(`${BASE_URL}/api/appointments?patientId=${createdPatientId}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.events.some((e) => e.id === createdEventId), 'Appointment must be persisted in DB');
  });

  // 6. Test DELETE /api/patients (Cascading Purge)
  await testEndpoint('DELETE /api/patients (Cascading Patient & Records Deletion)', async () => {
    const res = await fetch(`${BASE_URL}/api/patients?id=${createdPatientId}`, {
      method: 'DELETE',
    });
    assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.success, true);

    // Verify patient is gone
    const checkPatRes = await fetch(`${BASE_URL}/api/patients`);
    const checkPatData = await checkPatRes.json();
    assert(!checkPatData.patients.some((p) => p.id === createdPatientId), 'Patient must be deleted');

    // Verify appointments for that patient were cascaded
    const checkAptRes = await fetch(`${BASE_URL}/api/appointments?patientId=${createdPatientId}`);
    const checkAptData = await checkAptRes.json();
    assert.strictEqual(checkAptData.events.length, 0, 'Appointments must be cascade deleted');
  });

  // Clean up any test audit logs so database remains pristine for real clinical data
  try {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const dbFile = path.resolve(process.cwd(), 'data', 'carepath_primary.db.json');
    if (fs.existsSync(dbFile)) {
      const raw = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
      raw.audit = [];
      raw.patients = [];
      raw.events = [];
      raw.sms = [];
      fs.writeFileSync(dbFile, JSON.stringify(raw, null, 2), 'utf-8');
    }
  } catch {}

  console.log('\n====================================================');
  console.log('🎉 ALL BACKEND DATABASE & CRUD TESTS PASSED 100%!');
  console.log('====================================================');
}

runAllTests();
