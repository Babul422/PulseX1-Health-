const { supabaseAdmin } = require('../../config/supabase');

class SupabaseMedicalRecordProvider {
  async getByPatient(patientId) {
    const { data, error } = await supabaseAdmin.from('medical_records').select('*').eq('patient_id', patientId);
    if (error) throw error;
    return data;
  }

  async createRecord(recordData) {
    const { data, error } = await supabaseAdmin.from('medical_records').insert([recordData]).select().single();
    if (error) throw error;
    return data;
  }
}

module.exports = new SupabaseMedicalRecordProvider();
