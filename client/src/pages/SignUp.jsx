import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Validation function
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0\d{9}|\+94\d{9})$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone is required';
    } else if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone)) {
      newErrors.emailOrPhone = 'Enter a valid email or Sri Lankan phone number';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!passRegex.test(password)) {
      newErrors.password =
        'Password must be at least 8 characters, with 1 uppercase, 1 lowercase, and 1 number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Send OTP (instead of register directly)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const contact = emailOrPhone.trim();

      // 🔥 FIXED: Use full backend URL instead of relative URL
      const response = await fetch('http://localhost:5000/api/users/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact }),
      });

      // Add better error handling for HTML responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('❌ Server returned HTML instead of JSON:', textResponse);
        setErrors({ api: 'Server error. Make sure backend is running on port 5000.' });
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setErrors({ api: data?.message || 'Failed to send OTP' });
        setLoading(false);
        return;
      }

      // ✅ Save to localStorage for OTP verify + register later
      localStorage.setItem('signupName', fullName.trim());
      localStorage.setItem('signupPassword', password);
      localStorage.setItem('otpContact', contact);
      localStorage.setItem('otpPurpose', 'signup'); // Set purpose as 'signup'

      navigate('/otp-verification');
    } catch (error) {
      console.error('Send OTP error:', error);
      
      // Better error handling
      if (error.message.includes('fetch')) {
        setErrors({ api: 'Cannot connect to server. Make sure backend is running on port 5000.' });
      } else {
        setErrors({ api: 'Server error. Please try again later.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 -z-10"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      ></div>

      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          Create Your Account
        </h2>

        {/* 🔴 Error display */}
        {errors.api && (
          <p className="text-red-500 text-center text-sm mb-4">{errors.api}</p>
        )}

        <form onSubmit={handleSendOtp}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter First and Second name"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          {/* Email or Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email or Phone
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="Enter email or phone(with +94)"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.emailOrPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.emailOrPhone}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded transition"
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Sign Up'}
          </button>
        </form>

        {/* Link to Sign In */}
        <div className="text-sm text-center mt-4">
          Already have an account?{' '}
          <span
            className="text-orange-500 hover:underline cursor-pointer"
            onClick={() => navigate('/signin')}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;