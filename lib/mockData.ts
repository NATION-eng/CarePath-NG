import { PatientProfile, CareEvent, SmsMessage, AuditEvent } from './types';

export const INITIAL_PATIENTS: PatientProfile[] = [
  {
    id: 'pat-ada',
    code: 'CP-M-0842',
    name: 'Ada Eze',
    relationship: 'self',
    category: 'maternal',
    categoryLabel: 'Maternal & Antenatal Care',
    stageInfo: '32 Weeks Gestation',
    avatarInitials: 'AE',
    phoneOwnedByPatient: true,
    registeredPhone: '+234 803 456 7890',
    notificationContact: {
      name: 'Ada Eze (Self)',
      phone: '+234 803 456 7890',
      relationship: 'Self'
    }
  },
  {
    id: 'pat-chinedu',
    code: 'CP-C-1940',
    name: 'Baby Chinedu',
    relationship: 'child',
    category: 'immunisation',
    categoryLabel: 'National Immunisation (NPHCDA)',
    stageInfo: '6 Weeks Postnatal',
    avatarInitials: 'BC',
    phoneOwnedByPatient: false, // Phone-less patient
    registeredPhone: undefined,
    notificationContact: {
      name: 'Ada Eze (Mother / Proxy)',
      phone: '+234 803 456 7890',
      relationship: 'Mother (Authorised Guardian)'
    }
  },
  {
    id: 'pat-nkechi',
    code: 'CP-A-0419',
    name: 'Mama Nkechi (Elderly)',
    relationship: 'mother',
    category: 'general',
    categoryLabel: 'Chronic Care & Blood Pressure',
    stageInfo: 'Routine Clinic Review',
    avatarInitials: 'MN',
    phoneOwnedByPatient: false,
    registeredPhone: undefined,
    notificationContact: {
      name: 'Ada Eze (Daughter / Proxy)',
      phone: '+234 803 456 7890',
      relationship: 'Daughter (Caregiver)'
    }
  }
];

export const INITIAL_EVENTS: CareEvent[] = [
  // Baby Chinedu Immunisation Events
  {
    id: 'evt-chin-6wk',
    patientId: 'pat-chinedu',
    title: '6-Week Immunisation Visit',
    subtitle: 'Penta 1, OPV 1, PCV 1, Rotavirus 1',
    facilityName: 'Garki Primary Healthcare Centre',
    facilityAddress: 'Area 10, Garki, Abuja FCT',
    date: 'Tomorrow, Nov 14',
    time: '09:00 AM',
    duePeriod: '6 Weeks Milestone',
    status: 'scheduled',
    category: 'immunisation',
    instructions: [
      'Bring yellow child immunisation card',
      'Wear loose clothing easy for arm/thigh vaccination',
      'Arrive between 8:30 AM and 10:30 AM for morning session'
    ],
    clinicianName: 'Nurse Blessing Aliyu',
    clinicianRole: 'Senior Community Health Officer (CHO)',
    vaccines: ['Penta 1 (DTP-HepB-Hib)', 'OPV 1 (Polio)', 'PCV 1 (Pneumococcal)', 'Rotavirus 1 (Diarrhea protection)'],
    pidginAudioText: 'Good morning Mama Chinedu. Remember say tomorrow Thursday by 9 in the morning, na time for Baby Chinedu 6-week injection for Garki PHC. Carry your child yellow card come, make you wear am light cloth. If you go fit come, reply 1. If you wan change date, reply 2. Thank you!',
    englishAudioText: 'Good morning Ada. This is a reminder for Baby Chinedu\'s 6-week immunisation scheduled for tomorrow at Garki Primary Healthcare Centre by 9:00 AM. Please remember to bring the yellow immunisation card. Reply 1 to confirm attendance or 2 to request rescheduling.',
    reminderSent: true,
    reminderDeliveryStatus: 'delivered',
    lastNotificationSnippet: 'CarePath: Appointment for Baby Chinedu tomorrow at Garki PHC by 9:00 AM. Ref: #CP-1940. Reply 1 to Confirm.'
  },
  {
    id: 'evt-chin-birth',
    patientId: 'pat-chinedu',
    title: 'At-Birth Immunisation',
    subtitle: 'BCG, OPV 0, Hepatitis B',
    facilityName: 'Garki Primary Healthcare Centre',
    facilityAddress: 'Area 10, Garki, Abuja FCT',
    date: 'Oct 03, 2026',
    time: '11:30 AM',
    duePeriod: 'Birth Milestone',
    status: 'completed',
    category: 'immunisation',
    instructions: ['Administered at delivery ward', 'Scar review completed'],
    clinicianName: 'Matron Fatima Yusuf',
    clinicianRole: 'Nurse Midwife',
    vaccines: ['BCG (Tuberculosis)', 'OPV 0 (Birth Polio)', 'Hep B 0 (Hepatitis B at birth)'],
    pidginAudioText: 'Birth vaccine successfully completed.',
    englishAudioText: 'At-birth vaccines recorded as completed on hospital registry.',
    reminderSent: true,
    reminderDeliveryStatus: 'acknowledged'
  },
  {
    id: 'evt-chin-10wk',
    patientId: 'pat-chinedu',
    title: '10-Week Immunisation Visit',
    subtitle: 'Penta 2, OPV 2, PCV 2, Rotavirus 2',
    facilityName: 'Garki Primary Healthcare Centre',
    facilityAddress: 'Area 10, Garki, Abuja FCT',
    date: 'Dec 12, 2026',
    time: '09:00 AM',
    duePeriod: '10 Weeks Milestone',
    status: 'scheduled',
    category: 'immunisation',
    instructions: [
      'Minimum 4 weeks interval required after 6-week dose',
      'Bring yellow child immunisation card'
    ],
    clinicianName: 'Nurse Blessing Aliyu',
    clinicianRole: 'Senior Community Health Officer (CHO)',
    vaccines: ['Penta 2', 'OPV 2', 'PCV 2', 'Rotavirus 2'],
    pidginAudioText: 'Baby Chinedu 10-week appointment is scheduled for December 12 at Garki PHC.',
    englishAudioText: 'Baby Chinedu 10-week immunisation is scheduled for December 12 at Garki PHC.',
    reminderSent: false,
    reminderDeliveryStatus: 'scheduled'
  },
  {
    id: 'evt-chin-14wk',
    patientId: 'pat-chinedu',
    title: '14-Week Immunisation Visit',
    subtitle: 'Penta 3, OPV 3, PCV 3, IPV 1',
    facilityName: 'Garki Primary Healthcare Centre',
    facilityAddress: 'Area 10, Garki, Abuja FCT',
    date: 'Jan 09, 2027',
    time: '09:00 AM',
    duePeriod: '14 Weeks Milestone',
    status: 'scheduled',
    category: 'immunisation',
    instructions: ['Final dose for primary infant series before 6-month Vitamin A'],
    clinicianName: 'Nurse Blessing Aliyu',
    clinicianRole: 'Senior CHO',
    vaccines: ['Penta 3', 'OPV 3', 'PCV 3', 'IPV 1 (Injectable Polio)'],
    pidginAudioText: 'Baby Chinedu 14-week appointment.',
    englishAudioText: 'Baby Chinedu 14-week immunisation visit scheduled.',
    reminderSent: false,
    reminderDeliveryStatus: 'scheduled'
  },

  // Ada Maternal Events
  {
    id: 'evt-ada-32wk',
    patientId: 'pat-ada',
    title: '32-Week Antenatal Consultation & Lab Review',
    subtitle: 'Blood Pressure, Fetal Growth & Urine Dipstick',
    facilityName: 'Garki Primary Healthcare Centre',
    facilityAddress: 'Area 10, Garki, Abuja FCT',
    date: 'Monday, Nov 17',
    time: '10:30 AM',
    duePeriod: '3rd Trimester Care',
    status: 'scheduled',
    category: 'maternal',
    instructions: [
      'Bring green ANC hospital card and recent ultrasound report',
      'Stay hydrated; routine urine sample collected on arrival',
      'Review birth companion and emergency transport arrangements'
    ],
    clinicianName: 'Dr. Kelechi Nwosu',
    clinicianRole: 'Consultant Obstetrician / Senior Medical Officer',
    pidginAudioText: 'Good day Ada. Na reminder say your 32-week pregnancy checkup dey come up on Monday by half past 10 for Garki General Clinic. Remember carry your green hospital card and your scan paper. Reply 1 make we know say you dey come, or 2 if you wan change day. God bless you!',
    englishAudioText: 'Good day Ada. This is a reminder for your 32-week Antenatal Consultation on Monday at 10:30 AM at Garki Primary Healthcare Centre. Please remember to bring your green ANC card and recent scan results. Reply 1 to confirm or 2 to reschedule.',
    reminderSent: true,
    reminderDeliveryStatus: 'delivered',
    lastNotificationSnippet: 'CarePath: Antenatal clinic review on Monday, Nov 17 at 10:30 AM at Garki PHC. Ref: #CP-0842. Reply 1 to Confirm.'
  },
  {
    id: 'evt-ada-36wk',
    patientId: 'pat-ada',
    title: '36-Week Birth Preparation & Delivery Plan',
    subtitle: 'Presentation Scan & Maternal Health Review',
    facilityName: 'Garki Primary Healthcare Centre',
    facilityAddress: 'Area 10, Garki, Abuja FCT',
    date: 'Dec 15, 2026',
    time: '10:00 AM',
    duePeriod: 'Term Preparation',
    status: 'scheduled',
    category: 'maternal',
    instructions: [
      'Confirm delivery bag items (baby clothes, sanitary materials, receiving blanket)',
      'Confirm designated driver or emergency transport phone number'
    ],
    clinicianName: 'Dr. Kelechi Nwosu',
    clinicianRole: 'Consultant Obstetrician',
    pidginAudioText: '36-week delivery planning clinic.',
    englishAudioText: '36-week birth preparation appointment.',
    reminderSent: false,
    reminderDeliveryStatus: 'scheduled'
  }
];

export const INITIAL_SMS_LOG: SmsMessage[] = [
  {
    id: 'sms-101',
    sender: 'CAREPATH-NG',
    recipientPhone: '+234 803 456 7890',
    recipientName: 'Ada Eze',
    patientName: 'Baby Chinedu',
    messageText: 'CarePath: Important visit scheduled for Baby Chinedu at Garki PHC tomorrow (Nov 14) by 9:00 AM. Bring yellow card. Reply 1 to Confirm, 2 to Reschedule.',
    timestamp: 'Today, 8:00 AM',
    deliveryStatus: 'delivered',
    discreet: true,
    referenceCode: 'CP-1940'
  },
  {
    id: 'sms-100',
    sender: 'CAREPATH-NG',
    recipientPhone: '+234 803 456 7890',
    recipientName: 'Ada Eze',
    patientName: 'Ada Eze',
    messageText: 'CarePath: Scheduled Antenatal consultation for Ada Eze on Mon Nov 17 at 10:30 AM at Garki PHC. Ref: CP-0842. Reply 1 to Confirm.',
    timestamp: 'Yesterday, 9:15 AM',
    deliveryStatus: 'delivered',
    discreet: true,
    referenceCode: 'CP-0842'
  }
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-001',
    timestamp: '08:00:12 WAT',
    action: 'SMS_DELIVERY_CONFIRMED',
    details: 'DLR received from MTN Nigeria via Transactional Route. Message ID #TX-994827',
    actor: 'Telco Worker / Termii Adapter',
    status: 'success'
  },
  {
    id: 'aud-002',
    timestamp: '08:00:03 WAT',
    action: 'REMINDER_DISPATCHED',
    details: 'Discreet template formatted for Baby Chinedu 6-week immunisation. Recipient: +2348034567890 (Ada Eze, Proxy)',
    actor: 'Care Continuity Engine',
    status: 'info'
  },
  {
    id: 'aud-003',
    timestamp: '07:59:58 WAT',
    action: 'OUTBOX_JOB_EVALUATED',
    details: 'Quiet-hours passed (07:00-21:00 WAT). Proxy permissions verified valid. Event status: scheduled.',
    actor: 'BullMQ Scheduler',
    status: 'info'
  },
  {
    id: 'aud-004',
    timestamp: 'Yesterday, 14:20 WAT',
    action: 'APPOINTMENT_CREATED',
    details: 'Nurse Blessing Aliyu registered 6-week Penta 1 schedule following NPHCDA v2024 guidance.',
    actor: 'Garki PHC Staff Portal',
    status: 'success'
  }
];
