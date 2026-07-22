const { dummyBloodBanks } = require('./dummyData');

class DummyBloodBankProvider {
  async getByHospital(hospitalId) {
    return dummyBloodBanks;
  }

  async updateInventory(bloodBankId, inventory) {
    const bb = dummyBloodBanks.find(b => b.id === bloodBankId);
    if (bb) {
      bb.blood_inventory = inventory;
      return bb;
    }
    return dummyBloodBanks[0];
  }
}

module.exports = new DummyBloodBankProvider();
