/**
 * PulseX Health Mock Production Dataset
 * Full-featured mock data for offline / dummy mode execution.
 */

const dummyUsers = [
  { id: 'usr-pat-01', email: 'patient@pulsex.health', full_name: 'Alex Johnson', phone: '+1 555 0192', role: 'patient' },
  { id: 'usr-doc-01', email: 'doctor@pulsex.health', full_name: 'Dr. Sarah Connor', phone: '+1 555 0193', role: 'doctor' },
  { id: 'usr-hosp-01', email: 'hospital@pulsex.health', full_name: 'City Care Hospital', phone: '+1 555 0194', role: 'hospital' },
  { id: 'usr-vol-01', email: 'volunteer@pulsex.health', full_name: 'Michael Chang', phone: '+1 555 0195', role: 'volunteer' },
  { id: 'usr-bb-01', email: 'bloodbank@pulsex.health', full_name: 'Metro Blood Center', phone: '+1 555 0196', role: 'blood_bank' },
  { id: 'usr-adm-01', email: 'admin@pulsex.health', full_name: 'PulseX System Admin', phone: '+1 555 0197', role: 'admin' }
];

const dummyHospitals = [
  {
    id: 'hosp-01',
    user_id: 'usr-hosp-01',
    name: 'City Care Emergency Hospital',
    registration_number: 'HOSP-NY-9021',
    address: '450 Healthcare Boulevard, Suite 100',
    city: 'New York',
    latitude: 40.7128,
    longitude: -74.0060,
    emergency_contact: '+1 800 555 0199',
    total_beds: 120,
    available_beds: 24,
    icu_beds: 30,
    available_icu_beds: 6,
    ot_status: '2 OTs Available',
    oxygen_status: 'High (98% Capacity)'
  },
  {
    id: 'hosp-02',
    user_id: 'usr-hosp-02',
    name: 'Apex Trauma & Cardiac Center',
    registration_number: 'HOSP-NY-4482',
    address: '88 Tech Medical Drive',
    city: 'New York',
    latitude: 40.7306,
    longitude: -73.9352,
    emergency_contact: '+1 800 555 0200',
    total_beds: 200,
    available_beds: 45,
    icu_beds: 50,
    available_icu_beds: 12,
    ot_status: '4 OTs Available',
    oxygen_status: 'Optimal (100% Capacity)'
  },
  {
    id: 'hosp-03',
    user_id: 'usr-hosp-03',
    name: 'St. Jude General Hospital',
    registration_number: 'HOSP-NJ-1102',
    address: '12 Hudson River Way',
    city: 'Jersey City',
    latitude: 40.7178,
    longitude: -74.0431,
    emergency_contact: '+1 800 555 0211',
    total_beds: 95,
    available_beds: 8,
    icu_beds: 20,
    available_icu_beds: 2,
    ot_status: '1 OT Available',
    oxygen_status: 'Medium (75% Capacity)'
  }
];

const dummyDoctors = [
  {
    id: 'doc-01',
    user_id: 'usr-doc-01',
    full_name: 'Dr. Sarah Connor',
    specialization: 'Cardiology & Emergency Medicine',
    license_number: 'LIC-MED-88910',
    hospital_id: 'hosp-01',
    hospital_name: 'City Care Emergency Hospital',
    experience_years: 14,
    consultation_fee: 150.00,
    rating: 4.9,
    available_status: 'available'
  },
  {
    id: 'doc-02',
    user_id: 'usr-doc-02',
    full_name: 'Dr. Marcus Vance',
    specialization: 'Neurology & Trauma Surgery',
    license_number: 'LIC-MED-77123',
    hospital_id: 'hosp-02',
    hospital_name: 'Apex Trauma & Cardiac Center',
    experience_years: 18,
    consultation_fee: 200.00,
    rating: 4.95,
    available_status: 'available'
  },
  {
    id: 'doc-03',
    user_id: 'usr-doc-03',
    full_name: 'Dr. Elena Rostova',
    specialization: 'Pediatrics & Intensive Care',
    license_number: 'LIC-MED-99301',
    hospital_id: 'hosp-01',
    hospital_name: 'City Care Emergency Hospital',
    experience_years: 11,
    consultation_fee: 120.00,
    rating: 4.8,
    available_status: 'busy'
  }
];

const dummyAmbulances = [
  {
    id: 'amb-01',
    hospital_id: 'hosp-01',
    vehicle_number: 'AMB-NYC-101',
    driver_name: 'John Miller',
    driver_phone: '+1 555 0881',
    ambulance_type: 'cardiac',
    current_status: 'available',
    current_latitude: 40.7130,
    current_longitude: -74.0070,
    eta_minutes: 4
  },
  {
    id: 'amb-02',
    hospital_id: 'hosp-02',
    vehicle_number: 'AMB-NYC-305',
    driver_name: 'David Rossi',
    driver_phone: '+1 555 0882',
    ambulance_type: 'icu',
    current_status: 'available',
    current_latitude: 40.7310,
    current_longitude: -73.9360,
    eta_minutes: 7
  }
];

const dummyBloodBanks = [
  {
    id: 'bb-01',
    hospital_id: 'hosp-01',
    name: 'City Care Blood Repository',
    contact_number: '+1 555 0331',
    location: 'Building B, Floor 1, City Care Hospital',
    blood_inventory: { 'A+': 15, 'A-': 4, 'B+': 20, 'B-': 3, 'AB+': 8, 'AB-': 2, 'O+': 32, 'O-': 6 }
  },
  {
    id: 'bb-02',
    hospital_id: 'hosp-02',
    name: 'Apex Blood & Plasma Center',
    contact_number: '+1 555 0332',
    location: 'Apex Medical Complex, New York',
    blood_inventory: { 'A+': 28, 'A-': 8, 'B+': 35, 'B-': 6, 'AB+': 12, 'AB-': 4, 'O+': 50, 'O-': 10 }
  }
];

const dummyVolunteers = [
  {
    id: 'vol-01',
    user_id: 'usr-vol-01',
    full_name: 'Michael Chang',
    phone: '+1 555 0195',
    qualification: 'Certified First Responder / EMT Basic',
    status: 'active',
    latitude: 40.7140,
    longitude: -74.0050,
    response_radius_km: 8.5
  },
  {
    id: 'vol-02',
    user_id: 'usr-vol-02',
    full_name: 'Sophia Martinez',
    phone: '+1 555 0198',
    qualification: 'Registered Nurse (RN) / CPR Trained',
    status: 'active',
    latitude: 40.7290,
    longitude: -73.9380,
    response_radius_km: 12.0
  }
];

const dummyEmergencyRequests = [
  {
    id: 'emg-1001',
    patient_id: 'usr-pat-01',
    patient_name: 'Alex Johnson',
    patient_phone: '+1 555 0192',
    emergency_type: 'Cardiac Emergency / Chest Pain',
    location: '45 Broad Street, New York, NY',
    latitude: 40.7060,
    longitude: -74.0110,
    status: 'in_transit',
    priority: 'critical',
    hospital_id: 'hosp-01',
    hospital_name: 'City Care Emergency Hospital',
    ambulance_id: 'amb-01',
    ambulance_vehicle: 'AMB-NYC-101',
    driver_name: 'John Miller',
    driver_phone: '+1 555 0881',
    eta_minutes: 3,
    created_at: new Date().toISOString()
  }
];

const dummyMedicalRecords = [
  {
    id: 'rec-01',
    patient_id: 'usr-pat-01',
    doctor_id: 'doc-01',
    doctor_name: 'Dr. Sarah Connor',
    title: 'ECG & Cardiac Evaluation Report',
    record_type: 'Diagnostic Report',
    description: 'Normal sinus rhythm. Slight ST elevation noted under exercise stress test.',
    diagnosis: 'Mild Angina Pectoris',
    prescription: 'Aspirin 81mg daily, Nitroglycerin sublingual as needed',
    file_url: '/docs/ecg_report_01.pdf',
    record_date: '2026-06-15'
  },
  {
    id: 'rec-02',
    patient_id: 'usr-pat-01',
    doctor_id: 'doc-02',
    doctor_name: 'Dr. Marcus Vance',
    title: 'Complete Blood Count (CBC) & Metabolic Panel',
    record_type: 'Lab Test',
    description: 'Hemoglobin 14.2 g/dL, WBC 6.5 k/uL, Platelets 240 k/uL. All markers within normal limits.',
    diagnosis: 'Routine Annual Health Assessment',
    prescription: 'Multivitamins daily',
    file_url: '/docs/cbc_report_02.pdf',
    record_date: '2026-05-10'
  }
];

const dummyAppointments = [
  {
    id: 'apt-01',
    patient_id: 'usr-pat-01',
    patient_name: 'Alex Johnson',
    doctor_id: 'doc-01',
    doctor_name: 'Dr. Sarah Connor',
    hospital_id: 'hosp-01',
    hospital_name: 'City Care Emergency Hospital',
    appointment_date: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'confirmed',
    consultation_type: 'offline',
    reason: 'Follow-up Cardiac Checkup'
  }
];

module.exports = {
  dummyUsers,
  dummyHospitals,
  dummyDoctors,
  dummyAmbulances,
  dummyBloodBanks,
  dummyVolunteers,
  dummyEmergencyRequests,
  dummyMedicalRecords,
  dummyAppointments
};
