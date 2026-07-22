const { supabase, supabaseAdmin } = require('../config/supabase');

class SupabaseService {
  // =========================================================
  // AUTHENTICATION & USERS
  // =========================================================

  async signUp({ email, password, fullName, phone, role }) {
    const userRole = role || 'patient';

    // 1. Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          role: userRole
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User registration failed.');

    const user = authData.user;

    // Auto-confirm user email for development mode
    try {
      await supabaseAdmin.auth.admin.updateUserById(user.id, { email_confirm: true });
    } catch (e) {
      console.warn('Auto-confirm notice:', e.message);
    }

    // Auto-login to return active session immediately
    let session = authData.session;
    if (!session) {
      try {
        const loginRes = await supabase.auth.signInWithPassword({ email, password });
        session = loginRes.data?.session;
      } catch (e) {
        console.warn('Auto-login session notice:', e.message);
      }
    }

    // 2. Ensure profile row exists in public.users
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: user.id,
        email: email,
        full_name: fullName,
        phone: phone,
        role: userRole
      })
      .select()
      .single();

    if (profileError) {
      console.warn('Profile sync notice:', profileError.message);
    }

    // 3. Create role specific record if patient, doctor, or hospital
    if (userRole === 'patient') {
      await supabaseAdmin.from('patients').upsert({
        user_id: user.id,
        emergency_contact: phone || null
      });
    } else if (userRole === 'doctor') {
      await supabaseAdmin.from('doctors').upsert({
        user_id: user.id,
        specialization: 'General Medicine',
        license_number: `DOC-${Date.now()}`
      });
    } else if (userRole === 'hospital') {
      await supabaseAdmin.from('hospitals').upsert({
        user_id: user.id,
        name: fullName || 'PulseX Health Center',
        registration_number: `HOSP-${Date.now()}`,
        address: 'Main Healthcare Complex'
      });
    }

    return {
      user: authData.user,
      session: authData.session,
      profile: profile || { id: user.id, email, full_name: fullName, role: userRole }
    };
  }

  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Fetch public profile
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      user: data.user,
      session: data.session,
      profile
    };
  }

  async signInWithGoogle(redirectTo) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || 'http://localhost:3000/api/auth/callback'
      }
    });

    if (error) throw error;
    return data;
  }

  async signOut(token) {
    if (token) {
      await supabase.auth.signOut();
    }
    return { success: true };
  }

  async getUserProfile(userId) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  // =========================================================
  // PATIENTS
  // =========================================================

  async getPatientByUserId(userId) {
    const { data, error } = await supabaseAdmin
      .from('patients')
      .select('*, users(*)')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updatePatientProfile(userId, patientData) {
    const { data, error } = await supabaseAdmin
      .from('patients')
      .upsert({ user_id: userId, ...patientData })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // =========================================================
  // DOCTORS
  // =========================================================

  async getAllDoctors() {
    const { data, error } = await supabaseAdmin
      .from('doctors')
      .select('*, users(full_name, email, phone), hospitals(name, city)');

    if (error) throw error;
    return data;
  }

  async getDoctorById(doctorId) {
    const { data, error } = await supabaseAdmin
      .from('doctors')
      .select('*, users(full_name, email, phone), hospitals(name, address, city)')
      .eq('id', doctorId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateDoctorStatus(doctorId, status) {
    const { data, error } = await supabaseAdmin
      .from('doctors')
      .update({ available_status: status })
      .eq('id', doctorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // =========================================================
  // HOSPITALS & BEDS
  // =========================================================

  async getAllHospitals() {
    const { data, error } = await supabaseAdmin
      .from('hospitals')
      .select('*, blood_banks(*), ambulances(*)');

    if (error) throw error;
    return data;
  }

  async getHospitalById(hospitalId) {
    const { data, error } = await supabaseAdmin
      .from('hospitals')
      .select('*, doctors(*), blood_banks(*), ambulances(*)')
      .eq('id', hospitalId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateBedAvailability(hospitalId, bedCounts) {
    const { data, error } = await supabaseAdmin
      .from('hospitals')
      .update(bedCounts)
      .eq('id', hospitalId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // =========================================================
  // BLOOD BANKS
  // =========================================================

  async getBloodBankByHospital(hospitalId) {
    const { data, error } = await supabaseAdmin
      .from('blood_banks')
      .select('*')
      .eq('hospital_id', hospitalId);

    if (error) throw error;
    return data;
  }

  async updateBloodInventory(bloodBankId, inventory) {
    const { data, error } = await supabaseAdmin
      .from('blood_banks')
      .update({ blood_inventory: inventory })
      .eq('id', bloodBankId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // =========================================================
  // AMBULANCES
  // =========================================================

  async getAllAmbulances() {
    const { data, error } = await supabaseAdmin
      .from('ambulances')
      .select('*, hospitals(name, emergency_contact)');

    if (error) throw error;
    return data;
  }

  async updateAmbulanceStatus(ambulanceId, status, location) {
    const updatePayload = { current_status: status };
    if (location) {
      updatePayload.current_latitude = location.latitude;
      updatePayload.current_longitude = location.longitude;
    }

    const { data, error } = await supabaseAdmin
      .from('ambulances')
      .update(updatePayload)
      .eq('id', ambulanceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // =========================================================
  // APPOINTMENTS
  // =========================================================

  async createAppointment(appointmentData) {
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .insert([appointmentData])
      .select('*, patients(*), doctors(*), hospitals(*)')
      .single();

    if (error) throw error;
    return data;
  }

  async getAppointmentsByPatient(patientId) {
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select('*, doctors(*, users(full_name)), hospitals(name, address)')
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  async getAppointmentsByDoctor(doctorId) {
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select('*, patients(*, users(full_name, phone))')
      .eq('doctor_id', doctorId)
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  async updateAppointmentStatus(appointmentId, status) {
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // =========================================================
  // EMERGENCY REQUESTS
  // =========================================================

  async createEmergencyRequest(emergencyData) {
    const { data, error } = await supabaseAdmin
      .from('emergency_requests')
      .insert([emergencyData])
      .select('*, patients(*, users(full_name, phone)), ambulances(*), hospitals(*)')
      .single();

    if (error) throw error;
    return data;
  }

  async getAllEmergencyRequests() {
    const { data, error } = await supabaseAdmin
      .from('emergency_requests')
      .select('*, patients(*, users(full_name, phone)), ambulances(*), hospitals(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateEmergencyStatus(requestId, status, ambulanceId, hospitalId) {
    const updateData = { status };
    if (ambulanceId) updateData.ambulance_id = ambulanceId;
    if (hospitalId) updateData.hospital_id = hospitalId;

    const { data, error } = await supabaseAdmin
      .from('emergency_requests')
      .update(updateData)
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // =========================================================
  // MEDICAL RECORDS
  // =========================================================

  async createMedicalRecord(recordData) {
    const { data, error } = await supabaseAdmin
      .from('medical_records')
      .insert([recordData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getMedicalRecordsByPatient(patientId) {
    const { data, error } = await supabaseAdmin
      .from('medical_records')
      .select('*, doctors(*, users(full_name))')
      .eq('patient_id', patientId)
      .order('record_date', { ascending: false });

    if (error) throw error;
    return data;
  }

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  async createNotification(notificationData) {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert([notificationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserNotifications(userId) {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async markNotificationRead(notificationId) {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = new SupabaseService();
