const { supabaseAdmin } = require('../../config/supabase');

class SupabaseAmbulanceProvider {
  async getAllAmbulances() {
    const { data, error } = await supabaseAdmin.from('ambulances').select('*');
    if (error) throw error;
    return data;
  }

  async updateStatus(ambulanceId, status, location) {
    const payload = { current_status: status };
    if (location) {
      payload.current_latitude = location.latitude;
      payload.current_longitude = location.longitude;
    }
    const { data, error } = await supabaseAdmin.from('ambulances').update(payload).eq('id', ambulanceId).select().single();
    if (error) throw error;
    return data;
  }
}

module.exports = new SupabaseAmbulanceProvider();
