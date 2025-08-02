import React, { useState } from 'react';
import { User, ShoppingCart, Bell, Star } from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John David',
    phone: '+94 75 023 3733',
    email: 'johndavid@gmail.com',
    location: 'Colombo, Western, Sri Lanka',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
  });
  
  const [feedback, setFeedback] = useState('');
  const [editForm, setEditForm] = useState({...profileData});
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submittedRatings, setSubmittedRatings] = useState([
    {
      id: 1,
      rating: 5,
      comment: "Excellent pizza and fast delivery!",
      date: "2024-07-28",
      orderItem: "Margherita Pizza"
    },
    {
      id: 2,
      rating: 4,
      comment: "Good taste but could be more cheesy",
      date: "2024-07-25",
      orderItem: "Pepperoni Pizza"
    },
    {
      id: 3,
      rating: 5,
      comment: "Perfect! Will order again",
      date: "2024-07-20",
      orderItem: "BBQ Chicken Pizza"
    }
  ]);

  const ratingData = [
    { stars: 5, percentage: 85 },
    { stars: 4, percentage: 70 },
    { stars: 3, percentage: 45 },
    { stars: 2, percentage: 25 },
    { stars: 1, percentage: 10 }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm({...editForm, profileImage: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfileData({...editForm});
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({...profileData});
    setIsEditing(false);
  };

  const renderStars = (count, filled = true) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const renderInteractiveStars = (rating, onStarClick, onStarHover, onStarLeave) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-8 h-8 cursor-pointer transition-colors ${
          i < (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
        }`}
        onClick={() => onStarClick(i + 1)}
        onMouseEnter={() => onStarHover(i + 1)}
        onMouseLeave={onStarLeave}
      />
    ));
  };

  const handleRatingClick = (rating) => {
    setUserRating(rating);
  };

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const clearRating = () => {
    setUserRating(0);
    setHoverRating(0);
  };

  const clearSubmittedRating = (ratingId) => {
    setSubmittedRatings(submittedRatings.filter(rating => rating.id !== ratingId));
  };

  const clearAllRatings = () => {
    setSubmittedRatings([]);
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-orange-500">PizzaZone</div>
          <div className="hidden md:flex space-x-8">
            <a href="/main" className="text-gray-700 hover:text-orange-500 font-medium">HOME</a>
            <a href="/menu" className="text-gray-700 hover:text-orange-500 font-medium">SHOP</a>
            <a href="/main" className="text-gray-700 hover:text-orange-500 font-medium">ABOUT US</a>
            <a href="/main" className="text-gray-700 hover:text-orange-500 font-medium">CONTACT</a>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-orange-500"/>
            <ShoppingCart className="w-6 h-6 text-gray-600 cursor-pointer hover:text-orange-500" />
            <User className="w-6 h-6 text-gray-600 cursor-pointer hover:text-orange-500" />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">My Profile</h2>
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6">
              <img
                src={editForm.profileImage}
                alt="Profile"
                className="w-48 h-48 rounded-full object-cover border-4 border-orange-100"
              />
              {isEditing && (
                <label className="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <User className="w-4 h-4" />
                </label>
              )}
            </div>

            <div className="w-full space-y-6">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full p-3 border-b-2 border-gray-200 focus:border-orange-500 outline-none text-lg font-semibold text-center"
                    placeholder="Full Name"
                  />
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full p-3 border-b-2 border-gray-200 focus:border-orange-500 outline-none text-center"
                    placeholder="Phone Number"
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full p-3 border-b-2 border-gray-200 focus:border-orange-500 outline-none text-center"
                    placeholder="Email Address"
                  />
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="w-full p-3 border-b-2 border-gray-200 focus:border-orange-500 outline-none text-center"
                    placeholder="Location"
                  />
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-gray-800 pb-2 border-b-2 border-gray-100">
                      {profileData.name}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 pb-2 border-b-2 border-gray-100">
                      {profileData.phone}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 pb-2 border-b-2 border-gray-100">
                      {profileData.email}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 pb-2 border-b-2 border-gray-100">
                      {profileData.location}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 flex space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-8 py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-8 py-3 bg-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-3 bg-orange-100 text-orange-600 rounded-full font-medium hover:bg-orange-200 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="space-y-8">
          {/* User Rating Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Rate Your Experience</h3>
            <div className="text-center">
              <p className="text-gray-600 mb-4">How would you rate our service?</p>
              <div className="flex justify-center space-x-2 mb-4">
                {renderInteractiveStars(userRating, handleRatingClick, handleRatingHover, handleRatingLeave)}
              </div>
              {userRating > 0 && (
                <div className="flex flex-col items-center space-y-3">
                  <p className="text-lg font-semibold text-orange-600">
                    You rated: {userRating} star{userRating !== 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={clearRating}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    Clear Rating
                  </button>
                </div>
              )}
              {userRating === 0 && (
                <p className="text-gray-400 text-sm">Click on stars to rate</p>
              )}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Feedbacks</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add your feedback in here"
              className="w-full h-32 p-4 border-2 border-orange-100 rounded-xl resize-none focus:border-orange-500 outline-none"
            />
            <button className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              Submit Feedback
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Rating Overview</h3>
            <div className="space-y-4">
              {ratingData.map((rating) => (
                <div key={rating.stars} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 w-20">
                    <span className="text-sm font-medium text-gray-700">{rating.stars}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">{rating.percentage}%</span>
                </div>
              ))}
            </div>
            
            {/* Overall Rating Display */}
            <div className="mt-8 p-6 bg-orange-50 rounded-xl">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-3xl font-bold text-orange-600">4.2</div>
                <div className="flex space-x-1">
                  {renderStars(4)}
                </div>
                <div className="text-gray-600">out of 5</div>
              </div>
              <div className="text-center text-sm text-gray-500 mt-2">
                Based on 1,234 reviews
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;