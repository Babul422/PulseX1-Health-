const { supabaseAdmin } = require('../../config/supabase');

class SupabaseBloodBankProvider {
  async getByHospital(hospitalId) {
    const { data, error } = await supabaseAdmin.from('blood_banks').select('*').eq('hospital_id', hospitalId);
    if (error) throw error;
    return data;
  }

  async updateInventory(bloodBankId, inventory) {
    const { data, error } = await supabaseAdmin.from('blood_banks').update({ blood_inventory: inventory }).eq('id', bloodBankId).select().single();
    if (error) throw error;
    return data;
  }
}

module.exports = new SupabaseBloodBankProvider();
