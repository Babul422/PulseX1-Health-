const express = require('express');
const router = express.Router();
const multer = require('multer');
const profileController = require('../controllers/profileController');
const { requireAuth } = require('../middleware/sessionMiddleware');

// Storage memory parser for multer
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// View route
router.get('/', requireAuth, profileController.renderProfilePage);

// API routes
router.put('/api/profile', requireAuth, profileController.updateProfile);
router.post('/api/profile/avatar', requireAuth, upload.single('avatar'), profileController.uploadAvatar);

module.exports = router;
