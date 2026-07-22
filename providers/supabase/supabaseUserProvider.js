const { supabase, supabaseAdmin } = require('../../config/supabase');

class SupabaseUserProvider {
  async signUp({ email, password, fullName, phone, role }) {
    const userRole = role || 'patient';
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone, role: userRole } }
    });

    if (authError) throw authError;
    const user = authData.user;

    try {
      await supabaseAdmin.auth.admin.updateUserById(user.id, { email_confirm: true });
    } catch (e) {
      console.warn('Auto-confirm notice:', e.message);
    }

    let session = authData.session;
    if (!session) {
      const loginRes = await supabase.auth.signInWithPassword({ email, password });
      session = loginRes.data?.session;
    }

    const { data: profile } = await supabaseAdmin
      .from('users')
      .upsert({ id: user.id, email, full_name: fullName, phone, role: userRole })
      .select()
      .single();

    return { user: authData.user, session, profile };
  }

  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return { user: data.user, session: data.session, profile };
  }

  async getProfile(userId) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = new SupabaseUserProvider();
