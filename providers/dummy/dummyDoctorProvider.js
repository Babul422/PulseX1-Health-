const { dummyDoctors } = require('./dummyData');

class DummyDoctorProvider {
  async getAllDoctors() {
    return dummyDoctors;
  }

  async getDoctorById(id) {
    const doctor = dummyDoctors.find(d => d.id === id);
    return doctor || dummyDoctors[0];
  }

  async updateStatus(doctorId, status) {
    const doctor = dummyDoctors.find(d => d.id === doctorId);
    if (doctor) {
      doctor.available_status = status;
      return doctor;
    }
    return dummyDoctors[0];
  }
}

module.exports = new DummyDoctorProvider();
