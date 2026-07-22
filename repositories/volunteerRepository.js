const { isDummyMode } = require('../config/dataConfig');
const dummyVolunteerProvider = require('../providers/dummy/dummyVolunteerProvider');
const supabaseVolunteerProvider = require('../providers/supabase/supabaseVolunteerProvider');

class VolunteerRepository {
  getProvider() {
    return isDummyMode() ? dummyVolunteerProvider : supabaseVolunteerProvider;
  }

  async getAllVolunteers() {
    return this.getProvider().getAllVolunteers();
  }

  async updateStatus(volunteerId, status) {
    return this.getProvider().updateStatus(volunteerId, status);
  }
}

module.exports = new VolunteerRepository();
