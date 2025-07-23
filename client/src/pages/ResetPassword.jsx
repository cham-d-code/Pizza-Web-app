import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const contact = localStorage.getItem('otpContact');

  const validate = () => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!newPassword || !confirmPassword) return 'All fields are required';
    if (newPassword !== confirmPassword) return 'Passwords do not match';
    if (!regex.test(newPassword)) return 'Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number';
    return '';
  };

  const handleReset = async () => {
    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) return setError(data.message || 'Reset failed');

      alert('✅ Password reset successful!');
      localStorage.removeItem('otpContact');
      navigate('/signin');
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Your Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          className="w-full bg-orange-400 text-white py-2 rounded hover:bg-orange-500 transition"
          onClick={handleReset}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
