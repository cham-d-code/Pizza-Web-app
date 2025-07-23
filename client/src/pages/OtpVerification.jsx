import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OtpVerification = () => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const contact = localStorage.getItem('otpContact');
  const purpose = localStorage.getItem('otpPurpose'); // "signup" or "forgot-password"

  const handleChange = (e, index) => {
    const newDigits = [...otpDigits];
    newDigits[index] = e.target.value;
    setOtpDigits(newDigits);

    // Focus next input
    if (e.target.value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerify = async () => {
    const otp = otpDigits.join('');

    if (otp.length !== 6) {
      setError('Please enter the full 6-digit OTP');
      return;
    }

    try {
      const response = await fetch('/api/users/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, otp }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Invalid OTP');
        return;
      }

      // ✅ Redirect based on purpose
      if (purpose === 'signup') {
        // Now create user
        const name = localStorage.getItem('signupName');
        const password = localStorage.getItem('signupPassword');

        const registerRes = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, emailOrPhone: contact, password }),
        });

        const regData = await registerRes.json();
        if (!registerRes.ok) {
          setError(regData.message || 'Registration failed');
          return;
        }

        navigate('/'); // Redirect to login
      } else if (purpose === 'forgot-password') {
        navigate('/reset-password');
      }

    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Verify OTP</h2>
        <p className="mb-4 text-sm text-gray-600">
          We sent a 6-digit OTP to <span className="font-semibold">{contact}</span>
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              className="w-10 h-10 text-center border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleVerify}
          className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded transition"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
