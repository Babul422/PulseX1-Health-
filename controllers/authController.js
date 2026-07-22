const authService = require('../services/authService');
const supabaseService = require('../services/supabaseService');

class AuthController {
  async signup(req, res, next) {
    try {
      const { email, password, fullName, phone, role } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required.' });
      }

      const result = await authService.signUp({ email, password, fullName, phone, role });
      
      const user = result.profile || result.user || {};
      res.cookie('pulsex_session', result.session?.access_token || `token_${user.id || 'usr-pat-01'}`, { httpOnly: true, maxAge: 30 * 86400000 });
      res.cookie('pulsex_user_id', user.id || 'usr-pat-01', { httpOnly: true, maxAge: 30 * 86400000 });
      res.cookie('pulsex_user_role', user.role || role || 'patient', { httpOnly: true, maxAge: 30 * 86400000 });
      res.cookie('pulsex_user_name', user.full_name || fullName || 'Alex Johnson', { httpOnly: true, maxAge: 30 * 86400000 });
      res.cookie('pulsex_logged_in', 'true', { httpOnly: true, maxAge: 30 * 86400000 });

      res.status(201).json({ success: true, message: 'Registration successful.', data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required.' });
      }

      const result = await authService.login({ email, password });

      const user = result.profile || result.user || {};
      res.cookie('pulsex_session', result.session?.access_token || `token_${user.id || 'usr-pat-01'}`, { httpOnly: true, maxAge: 30 * 86400000 });
      res.cookie('pulsex_user_id', user.id || 'usr-pat-01', { httpOnly: true, maxAge: 30 * 86400000 });
      res.cookie('pulsex_user_role', user.role || 'patient', { httpOnly: true, maxAge: 30 * 86400000 });
      res.cookie('pulsex_user_name', user.full_name || 'Alex Johnson', { httpOnly: true, maxAge: 30 * 86400000 });
      res.cookie('pulsex_logged_in', 'true', { httpOnly: true, maxAge: 30 * 86400000 });

      res.status(200).json({ success: true, message: 'Login successful.', data: result });
    } catch (error) {
      res.status(401).json({ success: false, error: error.message || 'Authentication failed.' });
    }
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.user?.id || 'usr-pat-01';
      const profile = await authService.getProfile(userId);
      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email address is required.' });
      }
      const result = await authService.sendForgotPasswordEmail(email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword({ token, newPassword });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie('pulsex_session');
      res.clearCookie('pulsex_user_id');
      res.clearCookie('pulsex_user_role');
      res.clearCookie('pulsex_user_name');
      res.clearCookie('pulsex_logged_in');

      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(200).json({ success: true, message: 'Logged out successfully.' });
      }
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  }

  async googleLogin(req, res, next) {
    try {
      const redirectUrl = `${req.protocol}://${req.get('host')}/api/auth/callback`;
      const data = await supabaseService.signInWithGoogle(redirectUrl);
      if (data && data.url) return res.redirect(data.url);
      res.status(400).json({ success: false, error: 'Failed to obtain Google OAuth redirect URL.' });
    } catch (error) {
      res.status(500).send(`
        <div style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h2 style="color: #ea4335;">Google Login Configuration Required</h2>
          <p>${error.message || 'Google OAuth is not enabled on Supabase.'}</p>
          <a href="/login" style="color: #00b4ff; text-decoration: underline;">← Back to Login</a>
        </div>
      `);
    }
  }

  async googleCallback(req, res, next) {
    res.send(`
      <!DOCTYPE html><html><head><title>Authenticating...</title></head>
      <body><script>
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        if (accessToken) {
          localStorage.setItem('pulsex_token', accessToken);
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/login?error=google_auth_failed';
        }
      </script></body></html>
    `);
  }
}

module.exports = new AuthController();
