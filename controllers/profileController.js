const profileService = require('../services/profileService');
const appointmentService = require('../services/appointmentService');
const emergencyService = require('../services/emergencyService');

class ProfileController {
  async renderProfilePage(req, res, next) {
    try {
      const user = req.user || {
        id: 'usr-pat-01',
        email: 'patient@pulsex.health',
        full_name: 'Alex Johnson',
        phone: '+1 555 0192',
        role: 'patient',
        blood_group: 'O+',
        age: 28,
        gender: 'Male',
        date_of_birth: '1998-05-14',
        address: '45 Broad Street, New York, NY',
        emergency_contact: '+1 800 555 0199',
        avatar_url: '/images/default-avatar.png'
      };

      const appointments = await appointmentService.getByPatient(user.id);
      const emergencies = await emergencyService.getAllRequests();

      res.render('profile', {
        user,
        appointments: appointments || [],
        emergencies: emergencies || [],
        stats: {
          totalAppointments: appointments ? appointments.length : 4,
          totalEmergencies: emergencies ? emergencies.length : 2,
          medicalReports: 5,
          bloodRequests: 1
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user?.id || 'usr-pat-01';
      const { full_name, phone, blood_group, age, date_of_birth, gender, address, emergency_contact } = req.body;

      const updated = await profileService.updateProfile(userId, {
        full_name,
        phone,
        blood_group,
        age: age ? parseInt(age, 10) : undefined,
        date_of_birth,
        gender,
        address,
        emergency_contact
      });

      // Update cookie if demo session
      res.cookie('pulsex_user_name', full_name || 'Alex Johnson', { httpOnly: true });

      res.status(200).json({ success: true, message: 'Profile updated successfully!', data: updated });
    } catch (error) {
      next(error);
    }
  }

  async uploadAvatar(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No image file provided.' });
      }

      const userId = req.user?.id || 'usr-pat-01';
      const avatarUrl = await profileService.uploadAvatar(
        userId,
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname
      );

      res.status(200).json({ success: true, message: 'Avatar updated successfully!', avatar_url: avatarUrl });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
