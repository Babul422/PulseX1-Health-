const ambulanceRepository = require('../repositories/ambulanceRepository');

class AmbulanceService {
  async getAllAmbulances() {
    return ambulanceRepository.getAllAmbulances();
  }

  async updateAmbulanceStatus(ambulanceId, status, location) {
    return ambulanceRepository.updateStatus(ambulanceId, status, location);
  }
}

module.exports = new AmbulanceService();
