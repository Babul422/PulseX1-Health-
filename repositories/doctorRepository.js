const { isDummyMode } = require('../config/dataConfig');
const dummyDoctorProvider = require('../providers/dummy/dummyDoctorProvider');
const supabaseDoctorProvider = require('../providers/supabase/supabaseDoctorProvider');

class DoctorRepository {
  getProvider() {
    return isDummyMode() ? dummyDoctorProvider : supabaseDoctorProvider;
  }

  async getAllDoctors() {
    return this.getProvider().getAllDoctors();
  }

  async getDoctorById(id) {
    return this.getProvider().getDoctorById(id);
  }

  async updateStatus(doctorId, status) {
    return this.getProvider().updateStatus(doctorId, status);
  }
}

module.exports = new DoctorRepository();
