import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';

// Add Montserrat font
const montserratStyle = {
  fontFamily: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
};

const PaymentDetails = () => {
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
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Mock user ID for testing - replace with actual authentication
  const userId = 'mock-user-id';
  const MINIMUM_ORDER_AMOUNT = 20000; // 20,000 LKR minimum

  // Fetch cart data
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const cartData = data.cart || {
          items: [],
          subtotal: 0,
          tax: 0,
          deliveryFee: 250,
          discount: { amount: 0 },
          total: 250
        };
        
        // Ensure minimum order amount
        if (cartData.subtotal < MINIMUM_ORDER_AMOUNT) {
          cartData.subtotal = MINIMUM_ORDER_AMOUNT;
          cartData.total = cartData.subtotal + cartData.deliveryFee + cartData.tax - (cartData.discount?.amount || 0);
        }
        
        setCart(cartData);
      } else {
        throw new Error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart details');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirmation = async () => {
    if (cart.subtotal < MINIMUM_ORDER_AMOUNT) {
      setError(`Minimum order amount is LKR ${MINIMUM_ORDER_AMOUNT.toLocaleString()}`);
      return;
    }

    try {
      setProcessingPayment(true);
      setError('');

      // Mock shipping address - in real app, this would come from user selection
      const shippingAddress = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+94771234567',
        address: '123 Main Street',
        city: 'Colombo',
        district: 'Colombo',
        province: 'Western',
        postalCode: '10100',
        deliveryInstructions: 'Please call when arrived'
      };

      const orderData = {
        paymentMethod: paymentMethod,
        deliveryType: 'Delivery',
        newAddress: shippingAddress,
        customerNotes: 'Order placed via web application'
      };

      const response = await fetch('http://localhost:5000/api/orders/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        setShowSuccess(true);
        
        // Clear cart after successful order
        await fetch('http://localhost:5000/api/cart/clear', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userId}`,
            'Content-Type': 'application/json'
          }
        });

        // Redirect to profile after 2 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setError(error.message || 'Failed to process payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div style={montserratStyle} className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div style={montserratStyle} className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your order has been confirmed and will be prepared shortly.</p>
          <p className="text-sm text-gray-500">Redirecting to your profile...</p>
        </div>
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
              onClick={() => navigate('/cart')}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Payment Details</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Method Selection */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium">Credit/Debit Card</span>
                </label>
                
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <Truck className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium">Cash on Delivery</span>
                </label>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Delivery Address</p>
                    <p className="text-gray-600 text-sm">123 Main Street, Colombo 10100</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Estimated Delivery</p>
                    <p className="text-gray-600 text-sm">45-60 minutes</p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
            
            {/* Items */}
            <div className="space-y-3 mb-6">
              {cart.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.size} × {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-800">
                    LKR {item.totalPrice?.toLocaleString() || '0'}
                  </p>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-3 py-4 border-t border-gray-200">
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
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">LKR {cart.deliveryFee.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">LKR {cart.tax.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold text-orange-600">
                  LKR {cart.total.toLocaleString()}
                </span>
              </div>
            </div>

            {cart.subtotal < MINIMUM_ORDER_AMOUNT && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-amber-800 text-sm">
                  Minimum order amount is LKR {MINIMUM_ORDER_AMOUNT.toLocaleString()}. 
                  Please add more items to your cart.
                </p>
              </div>
            )}

            {/* Confirm Payment Button */}
            <button
              onClick={handlePaymentConfirmation}
              disabled={processingPayment || cart.subtotal < MINIMUM_ORDER_AMOUNT}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {processingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Confirm Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;