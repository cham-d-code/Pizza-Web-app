import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ForgotPasswordOtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get contact from previous page or localStorage
  const contact = location.state?.contact || localStorage.getItem('resetContact');

  useEffect(() => {
    // If no contact info, redirect back to forgot password page
    if (!contact) {
      navigate('/forgot-password');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [contact, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('🔍 Verifying reset OTP for:', contact);

      const response = await fetch('http://localhost:5000/api/users/verify-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: contact,
          otp: otp.toString().trim()
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error. Please try again.');
      }

      const data = await response.json();

      if (response.ok) {
        console.log('✅ OTP verified successfully');
        
        setSuccess('OTP verified successfully! Redirecting to reset password...');
        
        // Store reset token for password reset page
        localStorage.setItem('resetToken', data.resetToken);
        localStorage.setItem('resetContact', contact);
        
        // Clear the reset contact from current storage
        localStorage.removeItem('resetContact');
        
        // Redirect to reset password page after 2 seconds
        setTimeout(() => {
          navigate('/reset-password', { 
            state: { 
              resetToken: data.resetToken,
              contact: contact 
            }
          });
        }, 2000);

      } else {
        console.log('❌ OTP verification failed:', data.message);
        setError(data.message || 'OTP verification failed');
      }

    } catch (error) {
      console.error('❌ Verify OTP error:', error);
      
      if (error.message.includes('fetch')) {
        setError('Cannot connect to server. Please check your connection.');
      } else {
        setError(error.message || 'Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch('http://localhost:5000/api/users/send-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contact }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('New OTP sent successfully!');
        setCountdown(300);
        setCanResend(false);
        setOtp('');
      } else {
        setError(data.message || 'Failed to resend OTP');
      }

    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 6) {
      setOtp(value);
      setError(''); // Clear error when user types
    }
  };

  const handleGoBack = () => {
    localStorage.removeItem('resetContact');
    navigate('/forgot-password');
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
          Verify Reset Code
        </h2>

        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-gray-800 font-semibold">
            {contact?.includes('@') ? 
              contact.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 
              contact?.replace(/(\d{3})(\d{4})(\d{3})/, '$1****$3')
            }
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-700 text-sm text-center">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleVerifyOtp}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Enter Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="000000"
              maxLength="6"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-center text-2xl font-mono tracking-widest"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 text-center mt-2">
              {otp.length}/6 digits
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 px-4 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading || otp.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        {/* Countdown and Resend */}
        <div className="text-center mt-6">
          {countdown > 0 ? (
            <p className="text-gray-600 text-sm">
              Code expires in{' '}
              <span className="font-semibold text-orange-500">
                {formatTime(countdown)}
              </span>
            </p>
          ) : (
            <p className="text-gray-600 text-sm">Code has expired</p>
          )}
          
          {canResend && (
            <button
              onClick={handleResendOtp}
              className="text-orange-500 hover:text-orange-600 text-sm font-semibold mt-2 disabled:text-gray-400"
              disabled={loading}
            >
              Resend Code
            </button>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mt-4">
          <button
            onClick={handleGoBack}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            ← Back to Forgot Password
          </button>
        </div>

        {/* Debug Info (remove in production) */}
        
      </div>
    </div>
  );
};

export default ForgotPasswordOtpVerification;