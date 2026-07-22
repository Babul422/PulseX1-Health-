const { dummyEmergencyRequests, dummyHospitals, dummyAmbulances } = require('./dummyData');

class DummyEmergencyProvider {
  async createRequest(emergencyData) {
    const assignedHospital = dummyHospitals[0];
    const assignedAmbulance = dummyAmbulances[0];

    const newRequest = {
      id: `emg-${Date.now()}`,
      patient_id: emergencyData.patient_id || 'usr-pat-01',
      patient_name: emergencyData.patient_name || 'Alex Johnson',
      patient_phone: emergencyData.patient_phone || '+1 555 0192',
      emergency_type: emergencyData.emergency_type || 'Acute Medical Emergency',
      location: emergencyData.location || 'Current GPS Location',
      latitude: emergencyData.latitude || 40.7128,
      longitude: emergencyData.longitude || -74.0060,
      status: 'accepted',
      priority: emergencyData.priority || 'critical',
      hospital_id: assignedHospital.id,
      hospital_name: assignedHospital.name,
      ambulance_id: assignedAmbulance.id,
      ambulance_vehicle: assignedAmbulance.vehicle_number,
      driver_name: assignedAmbulance.driver_name,
      driver_phone: assignedAmbulance.driver_phone,
      eta_minutes: 5,
      created_at: new Date().toISOString()
    };

    dummyEmergencyRequests.unshift(newRequest);
    return newRequest;
  }

  async getAllRequests() {
    return dummyEmergencyRequests;
  }

  async getRequestById(id) {
    const req = dummyEmergencyRequests.find(r => r.id === id);
    return req || dummyEmergencyRequests[0];
  }

  async updateStatus(requestId, status, ambulanceId, hospitalId) {
    const req = dummyEmergencyRequests.find(r => r.id === requestId);
    if (req) {
      req.status = status;
      if (ambulanceId) req.ambulance_id = ambulanceId;
      if (hospitalId) req.hospital_id = hospitalId;
      return req;
    }
    return dummyEmergencyRequests[0];
  }
}

module.exports = new DummyEmergencyProvider();
