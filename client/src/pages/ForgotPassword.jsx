import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateContact = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0\d{9}|\+94\d{9})$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    // Validation
    if (!emailOrPhone) {
      setError('Email or phone is required');
      return;
    }

    if (!validateContact(emailOrPhone)) {
      setError('Enter a valid email or Sri Lankan phone number');
      return;
    }

    try {
      // Send OTP API call (mock or backend)
      const response = await fetch('/api/users/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: emailOrPhone }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Failed to send OTP');
        return;
      }

      // Save to localStorage for use in OTP verify and reset
      localStorage.setItem('otpContact', emailOrPhone);
      localStorage.setItem('otpPurpose', 'forgot-password');

      // Navigate to OTP verification
      navigate('/otp-verification');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 -z-10"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      ></div>

      {/* Card */}
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          Forgot Password
        </h2>

        <form onSubmit={handleSendOtp}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email or Phone Number
          </label>
          <input
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="example@email.com or 0771234567"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 mb-2"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded mt-4 transition"
          >
            Send OTP
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          Remembered your password?{' '}
          <a href="/signin" className="text-orange-500 hover:underline">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
