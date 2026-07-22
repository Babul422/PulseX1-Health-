const { dummyVolunteers } = require('./dummyData');

class DummyVolunteerProvider {
  async getAllVolunteers() {
    return dummyVolunteers;
  }

  async updateStatus(volunteerId, status) {
    const vol = dummyVolunteers.find(v => v.id === volunteerId);
    if (vol) {
      vol.status = status;
      return vol;
    }
    return dummyVolunteers[0];
  }
}

module.exports = new DummyVolunteerProvider();
