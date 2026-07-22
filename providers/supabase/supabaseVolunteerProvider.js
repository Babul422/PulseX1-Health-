const { supabaseAdmin } = require('../../config/supabase');

class SupabaseVolunteerProvider {
  async getAllVolunteers() {
    const { data, error } = await supabaseAdmin.from('volunteers').select('*, users(full_name, phone)');
    if (error) throw error;
    return data;
  }

  async updateStatus(volunteerId, status) {
    const { data, error } = await supabaseAdmin.from('volunteers').update({ status }).eq('id', volunteerId).select().single();
    if (error) throw error;
    return data;
  }
}

module.exports = new SupabaseVolunteerProvider();
