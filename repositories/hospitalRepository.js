const { isDummyMode } = require('../config/dataConfig');
const dummyHospitalProvider = require('../providers/dummy/dummyHospitalProvider');
const supabaseHospitalProvider = require('../providers/supabase/supabaseHospitalProvider');

class HospitalRepository {
  getProvider() {
    return isDummyMode() ? dummyHospitalProvider : supabaseHospitalProvider;
  }

  async getAllHospitals() {
    return this.getProvider().getAllHospitals();
  }

  async getHospitalById(id) {
    return this.getProvider().getHospitalById(id);
  }

  async updateBeds(hospitalId, bedCounts) {
    return this.getProvider().updateBeds(hospitalId, bedCounts);
  }
}

module.exports = new HospitalRepository();
