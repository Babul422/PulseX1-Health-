const { supabaseAdmin } = require('../../config/supabase');

class SupabaseEmergencyProvider {
  async createRequest(emergencyData) {
    const { data, error } = await supabaseAdmin.from('emergency_requests').insert([emergencyData]).select().single();
    if (error) throw error;
    return data;
  }

  async getAllRequests() {
    const { data, error } = await supabaseAdmin.from('emergency_requests').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getRequestById(id) {
    const { data, error } = await supabaseAdmin.from('emergency_requests').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async updateStatus(requestId, status, ambulanceId, hospitalId) {
    const payload = { status };
    if (ambulanceId) payload.ambulance_id = ambulanceId;
    if (hospitalId) payload.hospital_id = hospitalId;
    const { data, error } = await supabaseAdmin.from('emergency_requests').update(payload).eq('id', requestId).select().single();
    if (error) throw error;
    return data;
  }
}

module.exports = new SupabaseEmergencyProvider();
