// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOtp } = require('../controllers/userController');

// Register
router.post('/register', registerUser);

// Verify OTP
router.post('/verify-otp', verifyOtp);

// Login
router.post('/login', loginUser);

module.exports = router;
