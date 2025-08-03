const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Existing routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// OTP Routes for Signup Flow
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// OTP Routes for Forgot Password Flow  
router.post('/send-reset-otp', sendResetOtp);
router.post('/forgot-password', sendResetOtp); // ADD THIS LINE - alias for forgot-password
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;