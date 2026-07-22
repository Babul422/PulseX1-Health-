const { dummyMedicalRecords } = require('./dummyData');

class DummyMedicalRecordProvider {
  async getByPatient(patientId) {
    return dummyMedicalRecords;
  }

  async createRecord(recordData) {
    const newRecord = {
      id: `rec-${Date.now()}`,
      patient_id: recordData.patient_id || 'usr-pat-01',
      doctor_id: recordData.doctor_id || 'doc-01',
      doctor_name: 'Dr. Sarah Connor',
      title: recordData.title || 'Health Clinical Entry',
      record_type: recordData.record_type || 'Clinical Report',
      description: recordData.description || 'Routine evaluation',
      diagnosis: recordData.diagnosis || 'Stable condition',
      prescription: recordData.prescription || 'As advised',
      file_url: recordData.file_url || '/docs/report.pdf',
      record_date: new Date().toISOString().split('T')[0]
    };
    dummyMedicalRecords.unshift(newRecord);
    return newRecord;
  }
}

module.exports = new DummyMedicalRecordProvider();
