const { dummyAppointments, dummyDoctors } = require('./dummyData');

class DummyAppointmentProvider {
  async getByPatient(patientId) {
    return dummyAppointments;
  }

  async getByDoctor(doctorId) {
    return dummyAppointments;
  }

  async createAppointment(appointmentData) {
    const doctor = dummyDoctors.find(d => d.id === appointmentData.doctor_id) || dummyDoctors[0];
    const newApt = {
      id: `apt-${Date.now()}`,
      patient_id: appointmentData.patient_id || 'usr-pat-01',
      patient_name: 'Alex Johnson',
      doctor_id: doctor.id,
      doctor_name: doctor.full_name,
      hospital_id: doctor.hospital_id,
      hospital_name: doctor.hospital_name,
      appointment_date: appointmentData.appointment_date || new Date(Date.now() + 86400000).toISOString(),
      status: 'confirmed',
      consultation_type: appointmentData.consultation_type || 'offline',
      reason: appointmentData.reason || 'Medical Consultation'
    };
    dummyAppointments.unshift(newApt);
    return newApt;
  }

  async updateStatus(appointmentId, status) {
    const apt = dummyAppointments.find(a => a.id === appointmentId);
    if (apt) {
      apt.status = status;
      return apt;
    }
    return dummyAppointments[0];
  }
}

module.exports = new DummyAppointmentProvider();
