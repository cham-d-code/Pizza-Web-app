import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0\d{9}|\+94\d{9})$/;

    if (!emailOrPhone.trim()) {
      setError('Email or phone is required');
      return false;
    }

    if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone)) {
      setError('Please enter a valid email or Sri Lankan phone number');
      return false;
    }

    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setError('');
      const contact = emailOrPhone.trim();

      const response = await fetch('http://localhost:5000/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('❌ Server returned HTML instead of JSON:', textResponse);
        setError('Server error. Make sure backend is running on port 5000.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || 'Failed to send reset OTP');
        setLoading(false);
        return;
      }

      // Save to localStorage for OTP verification
      localStorage.setItem('otpContact', contact);
      localStorage.setItem('otpPurpose', 'forgot'); // Set purpose as 'forgot'

      // Navigate to the same OTP verification page
      navigate('/otp-verification');
      
    } catch (error) {
      console.error('Send reset OTP error:', error);
      
      if (error.message.includes('fetch')) {
        setError('Cannot connect to server. Make sure backend is running on port 5000.');
      } else {
        setError('Server error. Please try again later.');
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
          Forgot Password
        </h2>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email or phone number to receive a password reset code
        </p>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSendOtp}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email or Phone
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => {
                setEmailOrPhone(e.target.value);
                setError(''); // Clear error when typing
              }}
              placeholder="Enter your email or phone number"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading || !emailOrPhone.trim()}
          >
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>

        {/* Link to Sign In */}
        <div className="text-sm text-center mt-4">
          Remember your password?{' '}
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

export default ForgotPassword;