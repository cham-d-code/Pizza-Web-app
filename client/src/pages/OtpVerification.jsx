import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const contact = localStorage.getItem('otpContact');
  const name = localStorage.getItem('signupName');
  const password = localStorage.getItem('signupPassword');
  const purpose = localStorage.getItem('otpPurpose'); // 'signup' or 'forgot'

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const finalOtp = otp.join('');
    if (finalOtp.length !== 6) {
      setError('Please enter the full 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (purpose === 'signup') {
        // First verify OTP, then register
        const verifyResponse = await fetch('http://localhost:5000/api/users/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contact,
            otp: finalOtp,
          }),
        });

        const verifyData = await verifyResponse.json();
        if (!verifyResponse.ok) {
          setError(verifyData.message || 'Invalid OTP');
          setLoading(false);
          return;
        }

        // If OTP verified, proceed with registration
        const registerResponse = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            password,
            email: contact.includes('@') ? contact : undefined,
            phone: !contact.includes('@') ? contact : undefined,
          }),
        });

        const registerData = await registerResponse.json();
        if (!registerResponse.ok) {
          setError(registerData.message || 'Registration failed');
          setLoading(false);
          return;
        }

        // Clear localStorage and redirect
        localStorage.removeItem('otpContact');
        localStorage.removeItem('signupName');
        localStorage.removeItem('signupPassword');
        localStorage.removeItem('otpPurpose');
        
        alert('Account created successfully!');
        navigate('/signin');

      } else if (purpose === 'forgot') {
        // Verify reset OTP
        const response = await fetch('http://localhost:5000/api/users/verify-reset-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contact, otp: finalOtp }),
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.message || 'Invalid OTP');
          setLoading(false);
          return;
        }

        console.log('✅ OTP verification successful for password reset');
        
        // Store reset token and redirect to reset password page
        localStorage.setItem('resetToken', data.resetToken);
        localStorage.removeItem('otpContact');
        localStorage.removeItem('otpPurpose');
        
        navigate('/reset-password', { 
          state: { 
            resetToken: data.resetToken,
            contact: contact 
          }
        });
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Server error. Please try again later.');
      setLoading(false);
    }
  };

  // Get appropriate title and description based on purpose
  const getPageContent = () => {
    if (purpose === 'forgot') {
      return {
        title: 'Reset Password Verification',
        description: 'Please enter the 6-digit OTP sent to verify your identity'
      };
    }
    return {
      title: 'OTP Verification',
      description: 'Please enter the 6-digit OTP sent to complete your registration'
    };
  };

  const { title, description } = getPageContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          {description} <strong>{contact}</strong>
        </p>

        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

        <div className="flex justify-between gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-10 h-12 text-center text-lg border rounded focus:ring-2 focus:ring-orange-400"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={loading}
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading || otp.join('').length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        {/* Back button based on purpose */}
        <div className="text-center mt-4">
          <button
            onClick={() => {
              if (purpose === 'forgot') {
                navigate('/forgot-password');
              } else {
                navigate('/signup');
              }
            }}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
            disabled={loading}
          >
            ← Back to {purpose === 'forgot' ? 'Forgot Password' : 'Sign Up'}
          </button>
        </div>

        {/* Debug info in development */}
        
      </div>
    </div>
  );
};

export default OtpVerification;