const { dummyUsers } = require('./dummyData');

class DummyUserProvider {
  async signUp({ email, password, fullName, phone, role }) {
    const userRole = role || 'patient';
    const newUser = {
      id: `usr-${Date.now()}`,
      email,
      full_name: fullName || email.split('@')[0],
      phone: phone || '+1 555 0000',
      role: userRole
    };
    dummyUsers.push(newUser);

    return {
      user: { id: newUser.id, email: newUser.email },
      session: { access_token: `dummy_token_${newUser.id}` },
      profile: newUser
    };
  }

  async login({ email, password }) {
    const user = dummyUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Fallback for new demo emails
      const newUser = {
        id: `usr-${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        phone: '+1 555 0000',
        role: 'patient'
      };
      dummyUsers.push(newUser);
      return {
        user: { id: newUser.id, email: newUser.email },
        session: { access_token: `dummy_token_${newUser.id}` },
        profile: newUser
      };
    }

    return {
      user: { id: user.id, email: user.email },
      session: { access_token: `dummy_token_${user.id}` },
      profile: user
    };
  }

  async getProfile(userId) {
    const user = dummyUsers.find(u => u.id === userId);
    return user || dummyUsers[0];
  }
}

module.exports = new DummyUserProvider();
