const { isDummyMode } = require('../config/dataConfig');
const dummyEmergencyProvider = require('../providers/dummy/dummyEmergencyProvider');
const supabaseEmergencyProvider = require('../providers/supabase/supabaseEmergencyProvider');

class EmergencyRepository {
  getProvider() {
    return isDummyMode() ? dummyEmergencyProvider : supabaseEmergencyProvider;
  }

  async createRequest(emergencyData) {
    return this.getProvider().createRequest(emergencyData);
  }

  async getAllRequests() {
    return this.getProvider().getAllRequests();
  }

  async getRequestById(id) {
    return this.getProvider().getRequestById(id);
  }

  async updateStatus(requestId, status, ambulanceId, hospitalId) {
    return this.getProvider().updateStatus(requestId, status, ambulanceId, hospitalId);
  }
}

module.exports = new EmergencyRepository();
