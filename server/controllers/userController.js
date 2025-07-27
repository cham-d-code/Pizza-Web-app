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
    subject: 'Your OTP Code - Pizza App',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Your OTP Code</h2>
        <p>Your One-Time Password is:</p>
        <h1 style="color: #ff6b35; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `,
    text: `Your OTP is ${otp}. This code will expire in 5 minutes.`,
  });
};

// POST /api/users/send-otp
const sendOtp = asyncHandler(async (req, res) => {
  const { contact } = req.body;
  
  if (!contact) {
    res.status(400);
    throw new Error('Contact (email or phone) is required');
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

  // Find or create user
  let user = await User.findOne({ $or: [{ email: contact }, { phone: contact }] });
  
  if (!user) {
    // Create a temporary user record for OTP verification
    if (contact.includes('@')) {
      user = new User({ email: contact, isTemporary: true });
    } else {
      user = new User({ phone: contact, isTemporary: true });
    }
  }

  // Save OTP and expiry
  user.resetOtp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  // Send OTP
  if (contact.includes('@')) {
    await sendEmail(contact, otp);
    console.log(`📧 Email OTP sent to ${contact}: ${otp}`);
  } else {
    // TODO: Implement SMS with Twilio
    console.log(`📱 SMS OTP to ${contact}: ${otp}`);
  }

  res.status(200).json({ 
    message: 'OTP sent successfully',
    expiresIn: '5 minutes'
  });
});

// POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !password || (!email && !phone)) {
    res.status(400);
    throw new Error('Missing required fields');
  }

  const contact = email || phone;

  // Check if user already exists (and is not temporary)
  const existingUser = await User.findOne({
    $or: [
      email ? { email } : null,
      phone ? { phone } : null,
    ].filter(Boolean)
  });

  if (existingUser && !existingUser.isTemporary) {
    res.status(400);
    throw new Error('User already exists with this email or phone');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  // If user exists but is temporary (created during OTP verification), update it
  let user;
  if (existingUser && existingUser.isTemporary) {
    user = existingUser;
    user.name = name;
    user.password = hashedPassword;
    user.isTemporary = false;
    user.resetOtp = undefined;
    user.otpExpiry = undefined;
    await user.save();
  } else {
    user = await User.create({ 
      name, 
      email, 
      phone, 
      password: hashedPassword,
      isTemporary: false 
    });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  console.log('✅ User registered successfully:', contact);

  res.status(201).json({ 
    message: 'User registered successfully', 
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    },
    token 
  });
});

// POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;
  
  if (!password || (!email && !phone)) {
    res.status(400);
    throw new Error('Email/phone and password are required');
  }

  const user = await User.findOne({ 
    $or: [{ email }, { phone }],
    isTemporary: { $ne: true } // Don't allow login for temporary users
  });
  
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  res.status(200).json({ 
    message: 'Login successful', 
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    }
  });
});

// POST /api/users/forgot-password
const sendResetOtp = asyncHandler(async (req, res) => {
  const { contact } = req.body;

  if (!contact) {
    res.status(400);
    throw new Error('Contact (email or phone) is required');
  }

  // Search for user by email or phone
  const user = await User.findOne({
    $or: [{ email: contact }, { phone: contact }],
    isTemporary: { $ne: true }
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Send OTP via email or SMS
  if (contact.includes('@')) {
    await sendEmail(contact, otp);
    console.log(`📧 Reset OTP sent to ${contact}: ${otp}`);
  } else {
    // TODO: Implement SMS logic
    console.log(`📱 Reset OTP to ${contact}: ${otp}`);
  }

  // Save the OTP and expiry to the user's document
  user.resetOtp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  res.status(200).json({ 
    message: 'Password reset OTP sent successfully',
    expiresIn: '5 minutes'
  });
});

// POST /api/users/verify-otp (General OTP verification)
const verifyOtp = asyncHandler(async (req, res) => {
  const { contact, otp } = req.body;

  if (!contact || !otp) {
    res.status(400);
    throw new Error('Contact and OTP are required');
  }

  console.log('🔍 Verifying OTP for:', contact);
  console.log('🔍 OTP provided:', otp);

  const user = await User.findOne({
    $or: [{ email: contact }, { phone: contact }]
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  console.log('🔍 User found:', user.email || user.phone);
  console.log('🔍 Stored OTP:', user.resetOtp);
  console.log('🔍 OTP Expiry:', user.otpExpiry);

  if (!user.resetOtp) {
    res.status(400);
    throw new Error('No OTP found. Please request a new OTP.');
  }

  // Check if OTP has expired
  if (user.otpExpiry && new Date() > user.otpExpiry) {
    // Clear expired OTP
    user.resetOtp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    res.status(400);
    throw new Error('OTP has expired. Please request a new one.');
  }

  // Convert both to strings and trim whitespace for comparison
  const providedOtp = otp.toString().trim();
  const storedOtp = user.resetOtp.toString().trim();

  if (storedOtp !== providedOtp) {
    console.log('❌ OTP mismatch - Provided:', providedOtp, 'Stored:', storedOtp);
    res.status(400);
    throw new Error('Invalid OTP');
  }

  // OTP verified successfully - clear it
  user.resetOtp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  console.log('✅ OTP verified successfully for:', contact);

  res.status(200).json({ 
    message: 'OTP verified successfully',
    verified: true 
  });
});

// POST /api/users/verify-reset-otp (Specific for password reset)
const verifyResetOtp = asyncHandler(async (req, res) => {
  const { contact, otp } = req.body;

  if (!contact || !otp) {
    res.status(400);
    throw new Error('Contact and OTP are required');
  }

  console.log('🔍 Verifying reset OTP for:', contact, 'OTP:', otp);

  const user = await User.findOne({
    $or: [{ email: contact }, { phone: contact }],
    isTemporary: { $ne: true }
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  console.log('🔍 User found, stored OTP:', user.resetOtp, 'Expiry:', user.otpExpiry);

  if (!user.resetOtp) {
    res.status(400);
    throw new Error('No reset OTP found. Please request password reset again.');
  }

  // Check if OTP has expired
  if (user.otpExpiry && new Date() > user.otpExpiry) {
    user.resetOtp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    res.status(400);
    throw new Error('Reset OTP has expired. Please request a new one.');
  }

  if (user.resetOtp.toString().trim() !== otp.toString().trim()) {
    console.log('❌ OTP mismatch - Provided:', otp.toString().trim(), 'Stored:', user.resetOtp.toString().trim());
    res.status(400);
    throw new Error('Invalid OTP. Please check and try again.');
  }

  // Generate a reset token for password change
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  user.resetOtp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  console.log('✅ Reset OTP verified successfully for:', contact);

  res.status(200).json({ 
    message: 'OTP verified successfully! You can now reset your password.',
    success: true,
    resetToken, // Send this token to frontend for password reset
    redirectTo: '/reset-password' // Indicate where to redirect
  });
});

// POST /api/users/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    res.status(400);
    throw new Error('Reset token and new password are required');
  }

  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetExpires: { $gt: Date.now() },
    isTemporary: { $ne: true }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  // Update password and clear reset fields
  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successfully' });
});

module.exports = {
  sendOtp,
  registerUser,
  loginUser,
  sendResetOtp,
  verifyOtp,
  verifyResetOtp,
  resetPassword
};