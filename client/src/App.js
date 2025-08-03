// 📁 client/src/App.js or App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import OtpVerification from './pages/OtpVerification';
import ResetPassword from './pages/ResetPassword';
import ForgotPasswordOtpVerification from './pages/ForgotPasswordOtpVerification';
import Cart from './pages/Cart';
import Menu from './pages/Menu';
import PaymentDetails from './pages/PaymentDetails';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password-otp" element={<ForgotPasswordOtpVerification />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/payment-details" element={<PaymentDetails />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Optional: Default or Home page */}
        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
