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
import Main from './pages/Main';
import Store from './pages/Store';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import PaymentDetails from './pages/PaymentDetails';
import ContactUs from './pages/ContactUs';

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
        <Route path="/Cart" element={<Cart />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/main" element={<Main />} />
        <Route path="/store" element={<Store />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/payment-details" element={<PaymentDetails />} />
        <Route path="/contact-us" element={<ContactUs />} />


        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;
