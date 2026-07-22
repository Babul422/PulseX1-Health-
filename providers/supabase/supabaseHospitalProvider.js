const { supabaseAdmin } = require('../../config/supabase');

class SupabaseHospitalProvider {
  async getAllHospitals() {
    const { data, error } = await supabaseAdmin.from('hospitals').select('*');
    if (error) throw error;
    return data;
  }

  async getHospitalById(id) {
    const { data, error } = await supabaseAdmin.from('hospitals').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async updateBeds(hospitalId, bedCounts) {
    const { data, error } = await supabaseAdmin.from('hospitals').update(bedCounts).eq('id', hospitalId).select().single();
    if (error) throw error;
    return data;
  }
}

module.exports = new SupabaseHospitalProvider();
