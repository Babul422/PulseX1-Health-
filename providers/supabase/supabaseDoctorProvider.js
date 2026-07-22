const { supabaseAdmin } = require('../../config/supabase');

class SupabaseDoctorProvider {
  async getAllDoctors() {
    const { data, error } = await supabaseAdmin.from('doctors').select('*, users(full_name, email, phone), hospitals(name)');
    if (error) throw error;
    return data;
  }

  async getDoctorById(id) {
    const { data, error } = await supabaseAdmin.from('doctors').select('*, users(full_name, email, phone), hospitals(name)').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async updateStatus(doctorId, status) {
    const { data, error } = await supabaseAdmin.from('doctors').update({ available_status: status }).eq('id', doctorId).select().single();
    if (error) throw error;
    return data;
  }
}

module.exports = new SupabaseDoctorProvider();
