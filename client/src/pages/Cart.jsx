import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, Tag, MapPin, Phone } from 'lucide-react';

// Add Montserrat font
const montserratStyle = {
  fontFamily: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
};

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    tax: 0,
    deliveryFee: 250,
    discount: { amount: 0 },
    total: 250
  });
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [error, setError] = useState('');

  // Mock user ID for testing - replace with actual authentication
  const userId = 'mock-user-id';

  // Fetch cart data
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${userId}`, // Replace with actual auth token
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart || {
          items: [],
          subtotal: 0,
          tax: 0,
          deliveryFee: 250,
          discount: { amount: 0 },
          total: 250
        });
      } else if (response.status === 404) {
        // Empty cart - state already initialized
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart || cart);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart || cart);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const applyDiscount = async () => {
    if (!discountCode.trim()) return;
    
    try {
      setApplyingDiscount(true);
      const response = await fetch('http://localhost:5000/api/cart/discount', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: discountCode })
      });

      const data = await response.json();
      
      
      if (response.ok) {
        setCart(data.cart || cart);
        setDiscountCode('');
        setError('');
      } else {
        setError(data.message || 'Invalid discount code');
      }
    } catch (error) {
      console.error('Error applying discount:', error);
      setError('Failed to apply discount code');
    } finally {
      setApplyingDiscount(false);
    }
  };

  const removeDiscount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart/discount', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart || cart);
      }
    } catch (error) {
      console.error('Error removing discount:', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" style={montserratStyle}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
              {cart.items.length} items
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
                  {cart.items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear Cart
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {cart.items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600">Add some delicious pizzas to get started!</p>
                    <button className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.items.map((item) => (
                      <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          {/* Pizza Image */}
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                            <img
                              src={item.pizza?.image || '/api/placeholder/80/80'}
                              alt={item.pizza?.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>

                          {/* Item Details */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{item.pizza?.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">Size: {item.size}</p>
                            
                            {/* Customizations */}
                            {item.customizations && (
                              <div className="mt-2">
                                {item.customizations.extraCheese && (
                                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mr-2">
                                    Extra Cheese (+LKR 200)
                                  </span>
                                )}
                                {item.customizations.specialInstructions && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    Note: {item.customizations.specialInstructions}
                                  </p>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                  disabled={item.quantity >= 10}
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>

                              {/* Price and Remove */}
                              <div className="flex items-center gap-4">
                                <span className="font-semibold text-gray-800">
                                  LKR {item.itemTotal?.toLocaleString()}
                                </span>
                                <button
                                  onClick={() => removeItem(item._id)}
                                  className="text-orange-600 hover:text-orange-700 p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>

              {/* Discount Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={applyDiscount}
                    disabled={applyingDiscount || !discountCode.trim()}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Tag className="h-4 w-4" />
                    {applyingDiscount ? 'Applying...' : 'Apply'}
                  </button>
                </div>
                {error && (
                  <p className="text-orange-600 text-sm mt-1">{error}</p>
                )}
              </div>

              {/* Applied Discount */}
              {cart.discount?.code && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 font-medium">
                      {cart.discount.code} Applied!
                    </span>
                    <button
                      onClick={removeDiscount}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    You saved LKR {cart.discount.amount?.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">LKR {cart.subtotal.toLocaleString()}</span>
                </div>
                
                {cart.discount?.amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-LKR {cart.discount.amount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">LKR {cart.tax.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">LKR {cart.deliveryFee.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-orange-600">
                      LKR {cart.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/payment-details')}
                disabled={!cart.items.length}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Proceed to Checkout
              </button>

              
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default Cart;