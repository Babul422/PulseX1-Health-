const { isDummyMode } = require('../config/dataConfig');
const dummyBloodBankProvider = require('../providers/dummy/dummyBloodBankProvider');
const supabaseBloodBankProvider = require('../providers/supabase/supabaseBloodBankProvider');

class BloodBankRepository {
  getProvider() {
    return isDummyMode() ? dummyBloodBankProvider : supabaseBloodBankProvider;
  }

  async getByHospital(hospitalId) {
    return this.getProvider().getByHospital(hospitalId);
  }

  async updateInventory(bloodBankId, inventory) {
    return this.getProvider().updateInventory(bloodBankId, inventory);
  }
}

module.exports = new BloodBankRepository();
