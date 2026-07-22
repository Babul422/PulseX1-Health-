const { supabaseAdmin } = require('../../config/supabase');

class SupabaseAppointmentProvider {
  async getByPatient(patientId) {
    const { data, error } = await supabaseAdmin.from('appointments').select('*, doctors(specialization, users(full_name)), hospitals(name)').eq('patient_id', patientId);
    if (error) throw error;
    return data;
  }

  async getByDoctor(doctorId) {
    const { data, error } = await supabaseAdmin.from('appointments').select('*, patients(users(full_name, phone))').eq('doctor_id', doctorId);
    if (error) throw error;
    return data;
  }

  async createAppointment(appointmentData) {
    const { data, error } = await supabaseAdmin.from('appointments').insert([appointmentData]).select().single();
    if (error) throw error;
    return data;
  }

  async updateStatus(appointmentId, status) {
    const { data, error } = await supabaseAdmin.from('appointments').update({ status }).eq('id', appointmentId).select().single();
    if (error) throw error;
    return data;
  }
}

module.exports = new SupabaseAppointmentProvider();
