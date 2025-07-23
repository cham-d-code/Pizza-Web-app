import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailOrPhone || !password) {
      setError('Please enter email/phone and password');
      return;
    }

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: emailOrPhone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      // Store token or user data if needed
      localStorage.setItem('token', data.token); // Optional

      alert('Login successful!');
      navigate('/'); // or navigate to user dashboard
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 -z-10"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      ></div>

      {/* Login Box */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md bg-opacity-90">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In to Your Account</h2>

        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSignIn}>
          {/* Email or Phone */}
          <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone</label>
          <input
            type="text"
            value={emailOrPhone}
            onChange={e => setEmailOrPhone(e.target.value)}
            placeholder="Enter email or phone"
            className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* Password */}
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-orange-400 text-white font-semibold py-2 px-4 rounded hover:bg-orange-500 transition"
          >
            Sign In
          </button>
        </form>

        <div className="flex justify-between text-sm mt-4">
          <button
            className="text-orange-500 hover:underline"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </button>
          <button
            className="text-orange-500 hover:underline"
            onClick={() => navigate('/signup')}
          >
            Don't have an account?
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
