const supabaseService = require('../services/supabaseService');

class AppointmentController {
  async create(req, res, next) {
    try {
      const appointmentData = req.body;
      const appointment = await supabaseService.createAppointment(appointmentData);
      res.status(201).json({ success: true, data: appointment });
    } catch (error) {
      next(error);
    }
  }

  async getPatientAppointments(req, res, next) {
    try {
      const { patientId } = req.params;
      const appointments = await supabaseService.getAppointmentsByPatient(patientId);
      res.status(200).json({ success: true, data: appointments });
    } catch (error) {
      next(error);
    }
  }

  async getDoctorAppointments(req, res, next) {
    try {
      const { doctorId } = req.params;
      const appointments = await supabaseService.getAppointmentsByDoctor(doctorId);
      res.status(200).json({ success: true, data: appointments });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await supabaseService.updateAppointmentStatus(id, status);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AppointmentController();
