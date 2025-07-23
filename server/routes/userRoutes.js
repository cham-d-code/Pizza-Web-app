const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  sendOtp,
  registerUser,
  loginUser,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
} = require('../controllers/userController');

router.post('/send-otp', sendOtp);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', sendResetOtp);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);
router.get('/me', protect, (req, res) => res.status(200).json({ user: req.user }));

module.exports = router;
