import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, ShoppingCart, Bell, Star } from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profileImage: '',
  });
  const [editForm, setEditForm] = useState({ ...profileData });
  const [orders, setOrders] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Fetch profile and orders on mount
  useEffect(() => {
    let token = localStorage.getItem('token');
    
    // For development: if no token exists, set a valid test token
    if (!token || token === 'test-token-will-be-replaced') {
      console.warn('No valid token found, using test token for development');
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTc1NDIwMTY5NiwiZXhwIjoxNzU0ODA2NDk2fQ.HkKRVIs8z7P4bU0_yOtPMIl5ctJ8hJV3K7sv8UEF3ZM';
      localStorage.setItem('token', token);
    }
    
    console.log('Using token:', token);
    
    axios.get('http://localhost:5000/api/users/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        console.log('Profile data received:', res.data);
        setProfileData(res.data);
        setEditForm(res.data);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        console.error('Error response:', error.response?.data);
      });
    
    axios.get('http://localhost:5000/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data.data))
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm({ ...editForm, profileImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    console.log('Saving profile with data:', editForm);
    console.log('Token:', token);
    
    if (!token) {
      alert('Please log in to save your profile');
      return;
    }
    
    axios.put('http://localhost:5000/api/users/profile', editForm, { 
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      } 
    })
    .then(res => {
      console.log('Profile saved successfully:', res.data);
      setProfileData(res.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    })
    .catch(error => {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    });
  };

  const handleRatingSubmit = (orderId) => {
    if (!userRating) {
      alert('Please select a rating before submitting');
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem('token');
    
    // Use full URL for consistency like other components
    axios.post(`http://localhost:5000/api/orders/${orderId}/review`, { 
      rating: userRating, 
      comment: feedback 
    }, { 
      headers: { Authorization: `Bearer ${token}` } 
    })
    .then((response) => {
      console.log('Review submitted successfully:', response.data);
      setUserRating(0);
      setFeedback('');
      // Refresh orders to show review status
      axios.get('http://localhost:5000/api/orders', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setOrders(res.data.data));
    })
    .catch((error) => {
      console.error('Error submitting review:', error);
      // Add user feedback for errors
      alert('Failed to submit review. Please try again.');
    })
    .finally(() => setSubmitting(false));
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
                src={editForm.profileImage || '/default-avatar.png'}
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
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-3 border-b-2 border-gray-200 focus:border-orange-500 outline-none text-lg font-semibold text-center"
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-3 border-b-2 border-gray-200 focus:border-orange-500 outline-none text-center"
                    placeholder="Email Address"
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
                      {profileData.email}
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
                    onClick={() => { setEditForm(profileData); setIsEditing(false); }}
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

        {/* Orders, Feedback, and Rating */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Past Orders</h3>
            <ul>
              {orders.map(order => (
                <li key={order._id} className="mb-4 border-b pb-4">
                  <div>
                    <span className="font-semibold">Order #{order._id}</span> - {new Date(order.createdAt).toLocaleDateString()}
                    <span className={`ml-2 px-2 py-1 text-xs rounded ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div>
                    {order.items.map(item => (
                      <span key={item._id}>{item.pizza.name} x{item.quantity} </span>
                    ))}
                  </div>
                  {/* Show review form if not reviewed AND order is delivered */}
                  {(!order.review || !order.review.rating) && order.status === 'Delivered' ? (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        {[1,2,3,4,5].map(star => (
                          <Star
                            key={star}
                            className={`w-6 h-6 cursor-pointer ${userRating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            onClick={() => setUserRating(star)}
                          />
                        ))}
                      </div>
                      <textarea
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                        placeholder="Add your feedback"
                        className="w-full h-16 p-2 border rounded mt-2"
                      />
                      <button
                        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded"
                        onClick={() => {
                          console.log('Submitting review for order:', order._id);
                          console.log('Order status:', order.status);
                          handleRatingSubmit(order._id);
                        }}
                        disabled={submitting}
                      >
                        Submit Review
                      </button>
                    </div>
                  ) : order.status === 'Delivered' ? (
                    <div className="mt-2 text-green-600">
                      You rated: {order.review.rating} stars - "{order.review.comment}"
                    </div>
                  ) : (
                    <div className="mt-2 text-gray-500 text-sm">
                      Review will be available when order is delivered
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;