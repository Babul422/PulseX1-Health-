const { isDummyMode } = require('../config/dataConfig');
const dummyAmbulanceProvider = require('../providers/dummy/dummyAmbulanceProvider');
const supabaseAmbulanceProvider = require('../providers/supabase/supabaseAmbulanceProvider');

class AmbulanceRepository {
  getProvider() {
    return isDummyMode() ? dummyAmbulanceProvider : supabaseAmbulanceProvider;
  }

  async getAllAmbulances() {
    return this.getProvider().getAllAmbulances();
  }

  async updateStatus(ambulanceId, status, location) {
    return this.getProvider().updateStatus(ambulanceId, status, location);
  }
}

module.exports = new AmbulanceRepository();
