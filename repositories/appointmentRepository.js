const { isDummyMode } = require('../config/dataConfig');
const dummyAppointmentProvider = require('../providers/dummy/dummyAppointmentProvider');
const supabaseAppointmentProvider = require('../providers/supabase/supabaseAppointmentProvider');

class AppointmentRepository {
  getProvider() {
    return isDummyMode() ? dummyAppointmentProvider : supabaseAppointmentProvider;
  }

  async getByPatient(patientId) {
    return this.getProvider().getByPatient(patientId);
  }

  async getByDoctor(doctorId) {
    return this.getProvider().getByDoctor(doctorId);
  }

  async createAppointment(appointmentData) {
    return this.getProvider().createAppointment(appointmentData);
  }

  async updateStatus(appointmentId, status) {
    return this.getProvider().updateStatus(appointmentId, status);
  }
}

module.exports = new AppointmentRepository();
