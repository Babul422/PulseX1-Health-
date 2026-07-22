const hospitalRepository = require('../repositories/hospitalRepository');

class HospitalService {
  async getAllHospitals() {
    return hospitalRepository.getAllHospitals();
  }

  async getHospitalById(id) {
    return hospitalRepository.getHospitalById(id);
  }

  async updateBedAvailability(hospitalId, bedCounts) {
    return hospitalRepository.updateBeds(hospitalId, bedCounts);
  }
}

module.exports = new HospitalService();
