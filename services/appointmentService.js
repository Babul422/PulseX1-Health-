const appointmentRepository = require('../repositories/appointmentRepository');
const doctorRepository = require('../repositories/doctorRepository');

class AppointmentService {
  async getByPatient(patientId) {
    return appointmentRepository.getByPatient(patientId);
  }

  async getByDoctor(doctorId) {
    return appointmentRepository.getByDoctor(doctorId);
  }

  async createAppointment(appointmentData) {
    return appointmentRepository.createAppointment(appointmentData);
  }

  async updateStatus(appointmentId, status) {
    return appointmentRepository.updateStatus(appointmentId, status);
  }

  // Future Doctor Booking Extension Placeholders
  async searchDoctors({ specialty, city, hospitalId, availability }) {
    const doctors = await doctorRepository.getAllDoctors();
    return doctors.filter(doc => {
      let matches = true;
      if (specialty && !doc.specialization.toLowerCase().includes(specialty.toLowerCase())) matches = false;
      if (hospitalId && doc.hospital_id !== hospitalId) matches = false;
      return matches;
    });
  }

  async getAvailableSlots(doctorId, date) {
    return [
      { slot_time: '09:00 AM', status: 'available' },
      { slot_time: '10:30 AM', status: 'available' },
      { slot_time: '02:00 PM', status: 'available' },
      { slot_time: '04:15 PM', status: 'available' }
    ];
  }
}

module.exports = new AppointmentService();
