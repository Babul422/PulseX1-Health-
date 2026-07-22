const emergencyRepository = require('../repositories/emergencyRepository');
const aiService = require('./aiService');

class EmergencyService {
  async triggerSOS(sosPayload) {
    // 1. AI evaluation of emergency symptoms
    const triage = await aiService.evaluateTriage({
      symptoms: sosPayload.emergency_type || 'Acute Emergency SOS',
      severity: sosPayload.priority || 'critical'
    });

    // 2. Build full emergency request
    const requestData = {
      patient_id: sosPayload.patient_id || 'usr-pat-01',
      patient_name: sosPayload.patient_name || 'Emergency Patient',
      emergency_type: sosPayload.emergency_type || 'Cardiac Emergency SOS',
      location: sosPayload.location || 'Current GPS Location',
      latitude: sosPayload.latitude || 40.7128,
      longitude: sosPayload.longitude || -74.0060,
      priority: triage.urgency || 'critical'
    };

    // 3. Save emergency request via repository
    const created = await emergencyRepository.createRequest(requestData);

    return {
      emergency_request: created,
      ai_triage: triage,
      workflow_status: 'dispatched',
      tracking_url: `/emergency-tracking/${created.id}`
    };
  }

  async getAllRequests() {
    return emergencyRepository.getAllRequests();
  }

  async getRequestById(id) {
    return emergencyRepository.getRequestById(id);
  }

  async updateStatus(requestId, status, ambulanceId, hospitalId) {
    return emergencyRepository.updateStatus(requestId, status, ambulanceId, hospitalId);
  }
}

module.exports = new EmergencyService();
