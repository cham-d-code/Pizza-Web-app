import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Package, Clock, MapPin, Receipt, Star, ChevronDown, ChevronUp } from 'lucide-react';

// Add Montserrat font
const montserratStyle = {
  fontFamily: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
};

const Profile = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Mock user ID for testing - replace with actual authentication
  const userId = 'mock-user-id';

  // Mock user data - replace with actual user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+94771234567',
    joinDate: '2024-01-15'
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'out for delivery':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div style={montserratStyle} className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div style={montserratStyle} className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                  <p className="text-gray-600">Customer since {new Date(user.joinDate).getFullYear()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="font-medium text-gray-800">{orders.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Past Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <Package className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-800">Past Orders</h2>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-4">When you place your first order, it will appear here.</p>
                  <button
                    onClick={() => navigate('/menu')}
                    className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Order Header */}
                      <div 
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleOrderDetails(order._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="font-semibold text-gray-800">
                                Order #{order.orderNumber}
                              </h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{formatDate(order.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Receipt className="h-4 w-4" />
                                <span>LKR {order.total.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            {expandedOrder === order._id ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      {expandedOrder === order._id && (
                        <div className="border-t border-gray-200 bg-gray-50 p-4">
                          {/* Order Items */}
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-800 mb-3">Order Items:</h4>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2 bg-white rounded px-3">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-600">
                                      {item.size} × {item.quantity}
                                    </p>
                                  </div>
                                  <p className="font-medium text-gray-800">
                                    LKR {item.totalPrice.toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Delivery Address */}
                          {order.shippingAddress && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-800 mb-2">Delivery Address:</h4>
                              <div className="bg-white rounded p-3">
                                <p className="text-gray-800">
                                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                </p>
                                <p className="text-gray-600">
                                  {order.shippingAddress.address}, {order.shippingAddress.city}
                                </p>
                                <p className="text-gray-600">
                                  {order.shippingAddress.district}, {order.shippingAddress.province}
                                </p>
                                {order.shippingAddress.phone && (
                                  <p className="text-gray-600">{order.shippingAddress.phone}</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Order Summary */}
                          <div className="bg-white rounded p-3">
                            <h4 className="font-medium text-gray-800 mb-2">Order Summary:</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span>LKR {order.subtotal.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Fee:</span>
                                <span>LKR {order.deliveryFee.toLocaleString()}</span>
                              </div>
                              {order.tax > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Tax:</span>
                                  <span>LKR {order.tax.toLocaleString()}</span>
                                </div>
                              )}
                              {order.discount?.amount > 0 && (
                                <div className="flex justify-between text-green-600">
                                  <span>Discount:</span>
                                  <span>-LKR {order.discount.amount.toLocaleString()}</span>
                                </div>
                              )}
                              <div className="flex justify-between font-semibold text-base pt-2 border-t">
                                <span>Total:</span>
                                <span className="text-orange-600">LKR {order.total.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-4">
                            {order.status === 'Delivered' && !order.review && (
                              <button className="flex items-center gap-2 px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
                                <Star className="h-4 w-4" />
                                Rate Order
                              </button>
                            )}
                            <button 
                              onClick={() => navigate(`/track-order/${order._id}`)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              Track Order
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;