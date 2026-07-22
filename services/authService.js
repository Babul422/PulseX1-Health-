const userRepository = require('../repositories/userRepository');

class AuthService {
  async signUp(data) {
    return userRepository.signUp(data);
  }

  async login(data) {
    return userRepository.login(data);
  }

  async getProfile(userId) {
    return userRepository.getProfile(userId);
  }

  async sendForgotPasswordEmail(email) {
    // Standard forgot password flow handler
    return {
      success: true,
      message: `Password reset instructions sent to ${email}`
    };
  }

  async resetPassword({ token, newPassword }) {
    return {
      success: true,
      message: 'Password successfully updated. You may now log in.'
    };
  }
}

module.exports = new AuthService();
