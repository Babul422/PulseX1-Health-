const { isDummyMode } = require('../config/dataConfig');
const dummyMedicalRecordProvider = require('../providers/dummy/dummyMedicalRecordProvider');
const supabaseMedicalRecordProvider = require('../providers/supabase/supabaseMedicalRecordProvider');

class MedicalRecordRepository {
  getProvider() {
    return isDummyMode() ? dummyMedicalRecordProvider : supabaseMedicalRecordProvider;
  }

  async getByPatient(patientId) {
    return this.getProvider().getByPatient(patientId);
  }

  async createRecord(recordData) {
    return this.getProvider().createRecord(recordData);
  }
}

module.exports = new MedicalRecordRepository();
