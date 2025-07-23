import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
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

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          password,
          email: emailOrPhone.includes('@') ? emailOrPhone : undefined,
          phone: !emailOrPhone.includes('@') ? emailOrPhone : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ api: data.message || 'Server error' });
        return;
      }

      // ✅ Store data for OTP verification
      localStorage.setItem('signupName', fullName);
      localStorage.setItem('signupPassword', password);
      localStorage.setItem('otpContact', emailOrPhone);
      localStorage.setItem('otpPurpose', 'signup');
      console.log(data)

      navigate('/otp-verification');
    } catch (error) {
      setErrors({ api: 'Server error. Please try again later.' });
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

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Name"
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
              placeholder="Enter email or phone"
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
              placeholder="Create strong password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded transition"
          >
            Sign Up
          </button>
        </form>

        {/* Link to Sign In */}
        <div className="text-sm text-center mt-4">
          Already have an account?{' '}
          <span
            className="text-orange-500 hover:underline cursor-pointer"
            onClick={() => navigate('/Signin')}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
