const medicalRecordRepository = require('../repositories/medicalRecordRepository');

class MedicalRecordService {
  async getByPatient(patientId) {
    return medicalRecordRepository.getByPatient(patientId);
  }

  async createRecord(recordData) {
    return medicalRecordRepository.createRecord(recordData);
  }
}

module.exports = new MedicalRecordService();
