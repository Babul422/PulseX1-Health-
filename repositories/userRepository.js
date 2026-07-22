const { isDummyMode } = require('../config/dataConfig');
const dummyUserProvider = require('../providers/dummy/dummyUserProvider');
const supabaseUserProvider = require('../providers/supabase/supabaseUserProvider');

class UserRepository {
  getProvider() {
    return isDummyMode() ? dummyUserProvider : supabaseUserProvider;
  }

  async signUp(data) {
    return this.getProvider().signUp(data);
  }

  async login(data) {
    return this.getProvider().login(data);
  }

  async getProfile(userId) {
    return this.getProvider().getProfile(userId);
  }
}

module.exports = new UserRepository();
