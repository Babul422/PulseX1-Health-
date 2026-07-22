const { dummyHospitals } = require('./dummyData');

class DummyHospitalProvider {
  async getAllHospitals() {
    return dummyHospitals;
  }

  async getHospitalById(id) {
    const hospital = dummyHospitals.find(h => h.id === id);
    return hospital || dummyHospitals[0];
  }

  async updateBeds(hospitalId, bedCounts) {
    const hospital = dummyHospitals.find(h => h.id === hospitalId);
    if (hospital) {
      Object.assign(hospital, bedCounts);
      return hospital;
    }
    return dummyHospitals[0];
  }
}

module.exports = new DummyHospitalProvider();
