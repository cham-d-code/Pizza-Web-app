const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Utility: Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Utility: Send Email with OTP
const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}`,
  });
};


const sendOtp = asyncHandler(async (req, res) => {
  const { contact } = req.body;
  if (!contact) throw new Error('Contact (email or phone) is required');

  const otp = generateOTP();
  try {
    await sendEmail(contact, otp); // This is most likely failing
    res.status(200).json({ message: 'OTP sent' });
  } catch (err) {
    console.error("Error sending email:", err.message); // <== Look at this in your terminal
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
});

// POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    console.log('🔁 Register request:', req.body);

    if (!name || !password || (!email && !phone)) {
      console.log('❌ Missing fields');
      return res.status(400).json({ message: 'Missing fields' });
    }

    const existing = await User.findOne({
  $or: [
    email ? { email } : null,
    phone ? { phone } : null
  ].filter(Boolean)
});


    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, password: hashed });

    console.log('✅ Registered user:', user);
    res.status(201).json({ message: 'User registered', user });

  } catch (error) {
    console.error('❌ Error in registerUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;
  const user = await User.findOne({ $or: [{ email }, { phone }] });
  if (!user) throw new Error('User not found');
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.status(200).json({ message: 'Login successful', token });
});

// POST /api/users/forgot-password
// POST /api/users/forgot-password
const sendResetOtp = asyncHandler(async (req, res) => {
  const { contact } = req.body;

  // Search for user by email or phone
  const user = await User.findOne({
    $or: [{ email: contact }, { phone: contact }]
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const otp = generateOTP();

  // Send OTP via email or SMS
  if (contact.includes('@')) {
    await sendEmail(contact, otp); // Send email if contact is email
  } else {
    // TODO: send SMS if you implement Twilio later
    console.log(`SMS OTP to ${contact}: ${otp}`);
  }

  user.resetOtp = otp;
  await user.save();

  res.status(200).json({ message: 'Reset OTP sent' });
});


// POST /api/users/verify-reset-otp
const verifyResetOtp = asyncHandler(async (req, res) => {
  const { contact, otp } = req.body;
  const user = await User.findOne({ $or: [{ email: contact }, { phone: contact }] });
  if (!user || user.resetOtp !== otp) throw new Error('Invalid OTP');
  res.status(200).json({ message: 'OTP verified' });
});

// POST /api/users/reset-password
// POST /api/users/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { contact, newPassword } = req.body;

  if (!contact || !newPassword) {
    res.status(400);
    throw new Error('Contact and new password are required');
  }

  const user = await User.findOne({
    $or: [{ email: contact }, { phone: contact }]
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Password strength validation (optional server-side)
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passRegex.test(newPassword)) {
    res.status(400);
    throw new Error('Weak password');
  }

  // Hash and save new password
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOtp = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
});


module.exports = {
  sendOtp,
  registerUser,
  loginUser,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
};
