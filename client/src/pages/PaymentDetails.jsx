import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const location = useLocation();
  const cartFromState = location.state?.cart;
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [showAddCard, setShowAddCard] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [cardSaved, setCardSaved] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const [shippingDetails, setShippingDetails] = useState({
    name: 'Ruwanthi Jayassinghe',
    phone: '+94 75 023 3733',
    address: 'Faculty of Science, University of Kelaniya',
    city: 'Kelaniya',
    district: 'Gampaha',
    province: 'Western',
    country: 'Sri Lanka'
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });


  const orderItems = cartFromState?.items?.map(item => ({ name: item.name, price: item.price })) || [
    { name: 'Margherita', price: 2500.00 },
    { name: 'Sausage Delight', price: 2900.00 },
    { name: 'Veggie Masala Pizza', price: 2980.00 }
  ];
  const subtotal = cartFromState?.subtotal || orderItems.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal; // Use subtotal as total for payment

  const formatPrice = (price) => {
    return `LKR ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Card number formatting and validation
  const formatCardNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 16 digits
    const limitedDigits = digits.slice(0, 16);
    // Add spaces every 4 digits
    return limitedDigits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  // Expiry date formatting and validation
  const formatExpiryDate = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 4 digits
    const limitedDigits = digits.slice(0, 4);
    // Add slash after 2 digits
    if (limitedDigits.length >= 2) {
      return limitedDigits.slice(0, 2) + '/' + limitedDigits.slice(2);
    }
    return limitedDigits;
  };

  // CVV formatting and validation
  const formatCVV = (value) => {
    // Remove all non-digits and limit to 3 digits
    return value.replace(/\D/g, '').slice(0, 3);
  };

  // Validate expiry date
  const isValidExpiryDate = (expiryDate) => {
    if (expiryDate.length !== 5) return false; // MM/YY format
    
    const [month, year] = expiryDate.split('/');
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt('20' + year, 10); // Convert YY to 20YY
    
    // Check valid month
    if (monthNum < 1 || monthNum > 12) return false;
    
    // Check if date is in the future
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
    
    if (yearNum > currentYear) return true;
    if (yearNum === currentYear && monthNum >= currentMonth) return true;
    
    return false;
  };

  // Validate card details
  const validateCardDetails = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = cardDetails;
    
    // Remove spaces from card number for validation
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    
    // Check if all fields are filled
    if (!cleanCardNumber || !expiryDate || !cvv || !cardholderName.trim()) {
      return false;
    }
    
    // Validate card number (exactly 16 digits)
    if (cleanCardNumber.length !== 16) {
      return false;
    }
    
    // Validate expiry date
    if (!isValidExpiryDate(expiryDate)) {
      return false;
    }
    
    // Validate CVV (exactly 3 digits)
    if (cvv.length !== 3) {
      return false;
    }
    
    return true;
  };

  const handleConfirmPayment = async () => {
    // Prevent double clicks/multiple submissions
    if (isProcessingPayment) return;
    
    if (selectedPayment === 'add-card') {
      if (!validateCardDetails()) {
        alert('Add valid details');
        return;
      }
      // Card balance check: 10,000 LKR
      if (subtotal > 10000) {
        alert('Insufficient card balance (10,000 LKR limit for demo)');
        return;
      }
    }

    setIsProcessingPayment(true);

    // Prepare order payload
    const token = localStorage.getItem('token');
    const [firstName, ...rest] = shippingDetails.name.trim().split(' ');
    const lastName = rest.length > 0 ? rest.join(' ') : 'Unknown';
    const orderPayload = {
      items: cartFromState.items,
      subtotal: cartFromState.subtotal,
      tax: cartFromState.tax,
      deliveryFee: cartFromState.deliveryFee,
      discount: cartFromState.discount,
      total: subtotal, // Use subtotal as total for payment
      shippingAddress: {
        firstName,
        lastName,
        phone: shippingDetails.phone,
        address: shippingDetails.address,
        city: shippingDetails.city,
        district: shippingDetails.district,
        province: shippingDetails.province,
        // Optionally: postalCode: shippingDetails.postalCode,
        // Optionally: deliveryInstructions: shippingDetails.deliveryInstructions,
      },
      paymentMethod: 'Card', // or 'Cash on Delivery' if you add that option
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });
      if (response.ok) {
        setShowSuccessPopup(true);
      } else {
        alert('Order failed. Please try again.');
      }
    } catch (err) {
      alert('Order failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleShippingChange = (field, value) => {
    setShippingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCardDetailsChange = (field, value) => {
    let formattedValue = value;
    
    // Apply formatting based on field
    switch (field) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        break;
      case 'expiryDate':
        formattedValue = formatExpiryDate(value);
        break;
      case 'cvv':
        formattedValue = formatCVV(value);
        break;
      default:
        formattedValue = value;
    }
    
    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const handleSaveShipping = () => {
    setIsEditingShipping(false);
  };

  const handleCancelEdit = () => {
    setIsEditingShipping(false);
    // Reset to original values if needed
  };

  const handleConfirmCard = () => {
    // Validate card details
    if (!validateCardDetails()) {
      alert('Add valid details');
      return;
    }

    // Save card details (in a real app, this would be sent to a secure backend)
    console.log('Saving card details:', cardDetails);
    setCardSaved(true);
    
    // Show success message
    alert('Card details saved successfully!');
    
    // Switch back to card payment option
    setSelectedPayment('card');
  };

  const handleCancelCard = () => {
    setCardDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    });
    setSelectedPayment('card');
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-500">PizzaZone</h1>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="/main" className="text-gray-600 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">HOME</a>
                <a href="/menu" className="text-gray-600 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">SHOP</a>
                <a href="/main" className="text-gray-600 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">ABOUT US</a>
                <a href="/main" className="text-gray-600 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">CONTACT</a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              <div className="relative cursor-pointer">
                <svg className="w-6 h-6 text-gray-600 hover:text-orange-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </div>
              
              {/* Cart Icon */}
              <div className="relative cursor-pointer">
                <svg className="w-6 h-6 text-gray-600 hover:text-orange-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </div>
              
              {/* Profile Icon */}
              <div className="cursor-pointer">
                <svg className="w-6 h-6 text-gray-600 hover:text-orange-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          
          {/* Item Details Section */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Item Details</h2>
            
            <div className="bg-orange-50 rounded-xl p-6 mb-8">
              {orderItems.length === 0 ? (
                <div className="text-center text-gray-500">No items in your order.</div>
              ) : (
                orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3">
                    <span className="text-gray-800 font-medium">{item.name}</span>
                    <span className="text-gray-800 font-semibold">{formatPrice(item.price)}</span>
                  </div>
                ))
              )}
              {/* Removed subtotal row from here */}
            </div>

            {/* Sub Total Section */}
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sub Total</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Subtotal</span>
                  <span>{formatPrice(cartFromState?.subtotal || 0)}</span>
                </div>
                {cartFromState?.discount?.amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(cartFromState.discount.amount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatPrice(cartFromState?.tax || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>{formatPrice(cartFromState?.deliveryFee || 0)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center mt-2">
                  <span className="text-lg font-semibold text-gray-900">Sub Total</span>
                  <span className="text-lg font-bold text-orange-600">
                    {formatPrice(
                      (cartFromState?.subtotal || 0)
                      - (cartFromState?.discount?.amount || 0)
                      + (cartFromState?.tax || 0)
                      + (cartFromState?.deliveryFee || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods Section */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment methods</h2>
            
            <div className="space-y-4 mb-8">
              {/* Card Payment Option */}
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="card"
                  name="payment"
                  value="card"
                  checked={selectedPayment === 'card'}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-500"
                />
                <label htmlFor="card" className="flex items-center space-x-3 cursor-pointer">
                  <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                  <span className="text-gray-800 font-medium">Card</span>
                  {cardSaved && <span className="text-green-600 text-sm">(Saved)</span>}
                  <div className="flex space-x-1">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAzMiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iIzAwNTFBNSIvPgo8cGF0aCBkPSJNMTEuNSA3LjVIMTZ2NWgtNC41di01eiIgZmlsbD0id2hpdGUiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxNiAxMCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDFMMTEgOEw1IDhMOCAxWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=" alt="Visa" className="w-8 h-5" />
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAzMiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iI0VCMDAxQiIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI2IiBmaWxsPSIjRkY1RjAwIiBmaWxsLW9wYWNpdHk9IjAuNzUiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxMCIgcj0iNiIgZmlsbD0iI0VCMDAxQiIgZmlsbC1vcGFjaXR5PSIwLjc1Ii8+Cjwvc3ZnPgo=" alt="Mastercard" className="w-8 h-5" />
                  </div>
                </label>
              </div>
              
              {/* Add New Card Option */}
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="add-card"
                  name="payment"
                  value="add-card"
                  checked={selectedPayment === 'add-card'}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-500"
                />
                <label htmlFor="add-card" className="flex items-center space-x-3 cursor-pointer">
                  <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                  <span className="text-gray-800 font-medium">Add a new card</span>
                </label>
              </div>
            </div>

            {/* Add New Card Form */}
            {selectedPayment === 'add-card' && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) => handleCardDetailsChange('cardNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                      maxLength="19" // 16 digits + 3 spaces
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
  <input
    type="text"
    placeholder="MM/YY"
    value={cardDetails.expiryDate}
    onChange={(e) => {
      let value = e.target.value.replace(/[^\d]/g, ''); // Allow only digits

      if (value.length > 4) value = value.slice(0, 4); // Max 4 digits

      // Auto-insert "/" after 2 digits
      if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }

      // Only validate when user has entered MMYY (5 characters with '/')
      if (value.length === 5) {
        const [monthStr, yearStr] = value.split('/');
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);

        if (month < 1 || month > 12) {
          // Invalid Month — Reset only month part
          value = '';
        } else if (year < 25) {
          // Invalid Year — Reset only year part
          value = monthStr + '/';
        }
      }

      handleCardDetailsChange('expiryDate', value);
    }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
    maxLength="5"
  />
</div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardDetailsChange('cvv', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                        maxLength="3"
                      />
                    </div>
                  </div>
                  <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
  <input
    type="text"
    placeholder="John Doe"
    value={cardDetails.cardholderName}
    onChange={(e) => {
      const value = e.target.value;
      // Only allow letters and spaces
      if (/^[A-Za-z\s]*$/.test(value)) {
        handleCardDetailsChange('cardholderName', value);
      }
    }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
  />
</div>
                  
                  {/* Card Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      onClick={handleCancelCard}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmCard}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Details Section */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Details</h2>
            
            {!isEditingShipping ? (
              <div 
                className="bg-orange-50 rounded-xl p-6 mb-8 cursor-pointer hover:bg-orange-100 transition-colors"
                onClick={() => setIsEditingShipping(true)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{shippingDetails.name}</h3>
                    <p className="text-gray-700 mb-1">{shippingDetails.address}</p>
                    <p className="text-gray-700">{shippingDetails.city}, {shippingDetails.district}, {shippingDetails.province}, {shippingDetails.country}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700 font-medium">{shippingDetails.phone}</span>
                    <svg className="w-5 h-5 text-gray-400 hover:text-orange-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={shippingDetails.name}
                        onChange={(e) => handleShippingChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="text"
                        value={shippingDetails.phone}
                        onChange={(e) => handleShippingChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={shippingDetails.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={shippingDetails.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                      <input
                        type="text"
                        value={shippingDetails.district}
                        onChange={(e) => handleShippingChange('district', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                      <input
                        type="text"
                        value={shippingDetails.province}
                        onChange={(e) => handleShippingChange('province', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        value={shippingDetails.country}
                        onChange={(e) => handleShippingChange('country', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      onClick={handleCancelEdit}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveShipping}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Payment Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleConfirmPayment}
            disabled={isProcessingPayment}
            className={`font-bold py-3 px-8 rounded-xl transition-all duration-300 ${
              isProcessingPayment 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-1'
            } text-white`}
          >
            {isProcessingPayment ? 'Processing...' : 'Confirm Payments'}
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your order has been confirmed and will be delivered soon. Thank you for choosing PizzaZone!
              </p>
              <button
                onClick={() => { setShowSuccessPopup(false); navigate('/profile'); }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;