const supabaseService = require('../services/supabaseService');

class PatientController {
  async getMyProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const patient = await supabaseService.getPatientByUserId(userId);
      res.status(200).json({ success: true, data: patient });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const patientData = req.body;
      const updated = await supabaseService.updatePatientProfile(userId, patientData);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PatientController();
