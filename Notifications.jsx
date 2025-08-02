import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShoppingCart, User } from 'lucide-react';

const notifications = [
  {
    title: "🔥 Hot Deal! Buy 1 Large Pizza, Get 1 Free – Today Only!",
    message: "Don’t miss out! Add two pizzas to your cart and get the second one FREE.",
    date: "10 July 2025",
  },
  {
    title: "🎉 Weekend Offer: Flat 25% Off on All Orders Above Rs. 1500!",
    message: "Use code WEEKEND25 at checkout. Valid till Sunday midnight.",
    date: "25 June 2025",
  },
  {
    title: "📯 Order delivered! Enjoy your meal 😊",
    message: "Hope you love your pizza! Don’t forget to rate your experience.",
    date: "20 June 2025",
  },
  {
    title: "🍕 Combo Alert! Pizza + Garlic Bread + Drink @ Just Rs. 999!",
    message: "Limited time combo deal—perfect for a movie night at home!",
    date: "08 June 2025",
  },
  {
    title: "📩 Get 20% off your next order! 🎉",
    message: "Use code WEEKEND25 at checkout. Valid till Sunday midnight",
        date: "24 May 2025",
  },
];

const NotificationsPage = () => {
  const navigate = useNavigate();
  const notificationCount = notifications.length;

  return (
    <div className="bg-[#f6e7d8] min-h-screen font-sans">
      {/* Navbar */}
      <nav className="bg-white px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="text-2xl font-extrabold text-orange-600">PizzaZone</div>

        {/* Navigation links */}
        <div className="hidden md:flex space-x-8">
          <a href="/main" className="text-gray-600 hover:text-orange-500 text-sm font-medium">HOME</a>
          <a href="/menu" className="text-gray-600 hover:text-orange-500 text-sm font-medium">SHOP</a>
          <a href="/main" className="text-gray-600 hover:text-orange-500 text-sm font-medium">ABOUT US</a>
          <a href="/main" className="text-gray-600 hover:text-orange-500 text-sm font-medium">CONTACT</a>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <Bell className="w-6 h-6 text-gray-600 hover:text-orange-500 cursor-pointer" onClick={() => navigate('/notifications')} />
          <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-orange-500 cursor-pointer" onClick={() => navigate('/cart')} />
          <User className="w-6 h-6 text-gray-600 hover:text-orange-500 cursor-pointer" onClick={() => navigate('/profile')} />
        </div>
      </nav>

      {/* Notifications Heading */}
      <div className="text-center mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 inline-block">
          All Notifications
        </h2>
        <span className="bg-orange-500 text-white text-sm font-semibold px-2 py-1 rounded-full ml-2">
          {notificationCount}
        </span>
      </div>

      {/* Notifications List */}
      <div className="mt-8 max-w-3xl mx-auto space-y-4 px-4">
        {notifications.map((note, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-300">
            <div className="flex items-start">
              <div className="text-2xl mr-3">📩</div>
              <div>
                <p className="font-bold text-gray-800">{note.title}</p>
                <p className="text-sm text-gray-600">{note.message}</p>
              </div>
            </div>
            <p className="text-right text-xs text-gray-400 mt-2">{note.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;