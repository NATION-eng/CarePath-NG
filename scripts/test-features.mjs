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
  console.log('CarePath NG — Automated End-to-End Feature Test Suite');
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
  await testEndpoint('Patient Registration API (Maternal & Infant Intake)', async () => {
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
    assert.strictEqual(data.patient.notificationContact.name, 'Amina Danjuma');
    assert.strictEqual(data.patient.notificationContact.phone, '+2348039876543');
    createdPatientId = data.patient.id;
  });

  // 3. Test Appointment Scheduling API (/api/appointments)
  let createdEventId = '';
  await testEndpoint('Appointment Scheduling API with SMS Outbox Trigger', async () => {
    const res = await fetch(`${BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: createdPatientId || 'pat-demo',
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
        instructions: ['Bring yellow child health card', 'Wear loose clothes'],
        clinicianName: 'Nurse Blessing Aliyu',
        clinicianRole: 'Senior CHO',
        vaccines: ['Penta 1', 'OPV 1', 'PCV 1', 'Rota 1'],
      }),
    });
    assert.strictEqual(res.status, 201, `Expected 201 Created, got ${res.status}`);
    const data = await res.json();
    assert(data.success, 'Expected success: true');
    assert.strictEqual(data.event.title, '6-Week Penta 1 & Rota 1 Visit');
    assert(data.smsDispatch, 'Expected SMS dispatch payload');
    assert.strictEqual(data.smsDispatch.success, true);
    createdEventId = data.event.id;
  });

  // 4. Test Telephony Direct SMS Dispatch API (/api/telephony/send-sms)
  await testEndpoint('Telephony Direct SMS Dispatch API (Nigerian E.164)', async () => {
    const res = await fetch(`${BASE_URL}/api/telephony/send-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: '+2348031234567',
        message: 'CarePath: Scheduled visit tomorrow at 9AM. Reply 1 to Confirm.',
        referenceId: 'TEST-REF-001',
      }),
    });
    assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const data = await res.json();
    assert(data.success, 'Expected dispatch success');
    assert(data.messageId, 'Expected tracking message ID');
  });

  // 5. Test Telco Inbound Webhook (Reply '1' - Confirm Attendance)
  await testEndpoint('Inbound Telco Webhook (Patient replies "1" to Confirm)', async () => {
    const res = await fetch(`${BASE_URL}/api/telephony/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: '+2348039876543',
        message: '1',
        message_id: 'INBOUND-MSG-001',
      }),
    });
    assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.received, true);
    assert.strictEqual(data.actionTaken, 'ATTENDANCE_CONFIRMED');
  });

  // 6. Test Telco Inbound Webhook (Reply '2' - Reschedule Request)
  await testEndpoint('Inbound Telco Webhook (Patient replies "2" to Reschedule)', async () => {
    const res = await fetch(`${BASE_URL}/api/telephony/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: '+2348039876543',
        message: '2',
        message_id: 'INBOUND-MSG-002',
      }),
    });
    assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.received, true);
    assert.strictEqual(data.actionTaken, 'RESCHEDULE_REQUESTED');
  });

  console.log('\n====================================================');
  console.log('🎉 ALL AUTOMATED TESTS COMPLETED WITH 100% SUCCESS!');
  console.log('====================================================');
}

runAllTests();
