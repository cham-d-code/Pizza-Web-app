import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get reset token from location state or localStorage
  const resetToken = location.state?.resetToken || localStorage.getItem('resetToken');
  const contact = location.state?.contact || localStorage.getItem('resetContact');

  useEffect(() => {
    // If no reset token, redirect to forgot password
    if (!resetToken) {
      navigate('/forgot-password');
    }
  }, [resetToken, navigate]);

  const validatePassword = (password) => {
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passRegex.test(password);
  };

  const validate = () => {
    if (!newPassword) {
      setError('Please enter a new password');
      return false;
    }

    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch('http://localhost:5000/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resetToken: resetToken,
          newPassword: newPassword
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error. Please try again.');
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset successfully! Redirecting to login...');
        
        // Clear all reset-related data
        localStorage.removeItem('resetToken');
        localStorage.removeItem('resetContact');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/signin');
        }, 2000);

      } else {
        if (data.message.includes('expired') || data.message.includes('Invalid')) {
          setError('Reset link has expired. Please request a new password reset.');
          setTimeout(() => {
            navigate('/forgot-password');
          }, 3000);
        } else {
          setError(data.message || 'Password reset failed');
        }
      }

    } catch (error) {
      console.error('❌ Reset password error:', error);
      
      if (error.message.includes('fetch')) {
        setError('Cannot connect to server. Please check your connection.');
      } else {
        setError(error.message || 'Password reset failed. Please try again.');
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
          Reset Your Password
        </h2>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your new password below
        </p>

        {/* Success Message */}
        {success && (
          <p className="text-green-600 text-center text-sm mb-4">{success}</p>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleResetPassword}>
          {/* New Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter your new password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              disabled={loading}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="Confirm your new password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading || !newPassword || !confirmPassword}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-sm text-center mt-4">
          <span
            className="text-orange-500 hover:underline cursor-pointer"
            onClick={() => navigate('/signin')}
          >
            ← Back to Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;