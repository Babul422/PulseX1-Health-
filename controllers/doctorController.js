const supabaseService = require('../services/supabaseService');

class DoctorController {
  async getAllDoctors(req, res, next) {
    try {
      const doctors = await supabaseService.getAllDoctors();
      res.status(200).json({ success: true, data: doctors });
    } catch (error) {
      next(error);
    }
  }

  async getDoctorById(req, res, next) {
    try {
      const { id } = req.params;
      const doctor = await supabaseService.getDoctorById(id);
      res.status(200).json({ success: true, data: doctor });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await supabaseService.updateDoctorStatus(id, status);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DoctorController();
