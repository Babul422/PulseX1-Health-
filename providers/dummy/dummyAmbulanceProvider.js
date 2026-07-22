const { dummyAmbulances } = require('./dummyData');

class DummyAmbulanceProvider {
  async getAllAmbulances() {
    return dummyAmbulances;
  }

  async updateStatus(ambulanceId, status, location) {
    const amb = dummyAmbulances.find(a => a.id === ambulanceId);
    if (amb) {
      amb.current_status = status;
      if (location) {
        amb.current_latitude = location.latitude;
        amb.current_longitude = location.longitude;
      }
      return amb;
    }
    return dummyAmbulances[0];
  }
}

module.exports = new DummyAmbulanceProvider();
