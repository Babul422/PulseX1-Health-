const bloodBankRepository = require('../repositories/bloodBankRepository');

class BloodBankService {
  async getByHospital(hospitalId) {
    return bloodBankRepository.getByHospital(hospitalId);
  }

  async updateInventory(bloodBankId, inventory) {
    return bloodBankRepository.updateInventory(bloodBankId, inventory);
  }
}

module.exports = new BloodBankService();
