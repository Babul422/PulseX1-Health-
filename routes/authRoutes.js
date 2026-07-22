const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/google', authController.googleLogin);
router.get('/callback', authController.googleCallback);
router.get('/me', authenticateUser, authController.getProfile);
router.get('/logout', authController.logout);
router.post('/logout', authController.logout);

module.exports = router;
