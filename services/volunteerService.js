const volunteerRepository = require('../repositories/volunteerRepository');

class VolunteerService {
  async getAllVolunteers() {
    return volunteerRepository.getAllVolunteers();
  }

  async updateStatus(volunteerId, status) {
    return volunteerRepository.updateStatus(volunteerId, status);
  }
}

module.exports = new VolunteerService();
