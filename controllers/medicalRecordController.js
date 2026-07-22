const supabaseService = require('../services/supabaseService');

class MedicalRecordController {
  async createRecord(req, res, next) {
    try {
      const recordData = req.body;
      const record = await supabaseService.createMedicalRecord(recordData);
      res.status(201).json({ success: true, data: record });
    } catch (error) {
      next(error);
    }
  }

  async getPatientRecords(req, res, next) {
    try {
      const { patientId } = req.params;
      const records = await supabaseService.getMedicalRecordsByPatient(patientId);
      res.status(200).json({ success: true, data: records });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MedicalRecordController();
