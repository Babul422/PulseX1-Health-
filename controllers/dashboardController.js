const hospitalService = require('../services/hospitalService');
const doctorRepository = require('../repositories/doctorRepository');
const ambulanceService = require('../services/ambulanceService');
const bloodBankService = require('../services/bloodBankService');
const emergencyService = require('../services/emergencyService');
const medicalRecordService = require('../services/medicalRecordService');
const volunteerService = require('../services/volunteerService');
const appointmentService = require('../services/appointmentService');

class DashboardController {
  async renderDashboard(req, res, next) {
    try {
      const role = req.params.role || 'patient';
      const viewMap = {
        patient: 'dashboards/patient',
        doctor: 'dashboards/doctor',
        hospital: 'dashboards/hospital',
        volunteer: 'dashboards/volunteer',
        blood_bank: 'dashboards/blood_bank',
        admin: 'dashboards/admin'
      };

      const viewFile = viewMap[role] || 'dashboards/patient';

      // Load relevant data for dashboard view
      const hospitals = await hospitalService.getAllHospitals();
      const doctors = await doctorRepository.getAllDoctors();
      const ambulances = await ambulanceService.getAllAmbulances();
      const bloodBanks = await bloodBankService.getByHospital('hosp-01');
      const emergencies = await emergencyService.getAllRequests();
      const medicalRecords = await medicalRecordService.getByPatient('usr-pat-01');
      const volunteers = await volunteerService.getAllVolunteers();
      const appointments = await appointmentService.getByPatient('usr-pat-01');

      res.render(viewFile, {
        role,
        hospitals,
        doctors,
        ambulances,
        bloodBanks,
        emergencies,
        medicalRecords,
        volunteers,
        appointments,
        user: req.user || { full_name: 'PulseX User', role }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
