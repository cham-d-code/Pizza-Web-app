import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShoppingCart, User, Star, Minus, Plus } from 'lucide-react';

const MainPage = () => {
  const navigate = useNavigate();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState({});
  const [cartMessage, setCartMessage] = useState('');
  const [cartCount, setCartCount] = useState(0);

  // Add this line to define isAuthenticated
  const isAuthenticated = !!localStorage.getItem('token');

  // Fetch cart count on component mount
  React.useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart', {
          headers: {
            'Authorization': 'Bearer mock-user-id'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.cart && data.cart.itemCount) {
            setCartCount(data.cart.itemCount);
          }
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();
  }, []);

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSizeSelect = (itemId, size) => {
    setSelectedSizes(prev => ({ ...prev, [itemId]: size }));
  };

  const handleQuantityChange = (itemId, change) => {
    setQuantities(prev => {
      const current = prev[itemId] || 1;
      const newQuantity = Math.max(1, current + change);
      return { ...prev, [itemId]: newQuantity };
    });
  };

  const addToCart = async (item) => {
    const selectedSize = selectedSizes[item.id];
    const quantity = quantities[item.id] || 1;

    if (!selectedSize) {
      setCartMessage('Please select a size first');
      setTimeout(() => setCartMessage(''), 3000);
      return;
    }

    setLoading(prev => ({ ...prev, [item.id]: true }));

    try {
      // For now, we'll use the mock user ID from the backend
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-user-id' // This will be replaced with actual auth
        },
        body: JSON.stringify({
          pizzaId: item.id,
          size: selectedSize,
          quantity: quantity,
          customizations: {}
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCartMessage(`${item.name} added to cart!`);
        setTimeout(() => setCartMessage(''), 3000);
        // Reset quantity for this item
        setQuantities(prev => ({ ...prev, [item.id]: 1 }));
        // Update cart count
        if (data.cart && data.cart.itemCount) {
          setCartCount(data.cart.itemCount);
        }
      } else {
        setCartMessage(data.message || 'Failed to add to cart');
        setTimeout(() => setCartMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartMessage('Network error. Please try again.');
      setTimeout(() => setCartMessage(''), 3000);
    } finally {
      setLoading(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const menuItems = [
    { 
      id: '688e5f047198a5ba53f0d2c0',
      name: 'Margherita', 
      price: '1200.00', 
      img: 'margherita.jpg',
      description: 'Classic pizza with tomato sauce, mozzarella, and basil'
    },
    { 
      id: '688e5f047198a5ba53f0d2c3',
      name: 'Pepperoni', 
      price: '1400.00',
      img: 'pepperoni.jpg',
      description: 'Pepperoni, mozzarella, and tomato sauce'
    },
    { 
      id: '688e5f047198a5ba53f0d2c6',
      name: 'Veggie Supreme', 
      price: '1300.00',
      img: 'veggie.jpg',
      description: 'Loaded with fresh veggies and mozzarella'
    },
    { 
      id: '688e5f047198a5ba53f0d2c9',
      name: 'Chicken BBQ', 
      price: '1500.00', 
      img: 'bbq.jpg',
      description: 'BBQ chicken, onions, and mozzarella'
    }
  ];

  const customerReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment: "I loved the quick service and the taste of the pizza was amazing. Totally recommend PizzaZone!",
      date: "2 days ago"
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 5,
      comment: "Best pizza delivery in town! The Margherita is absolutely perfect. Will order again!",
      date: "1 week ago"
    },
    {
      id: 3,
      name: "Emma Davis",
      rating: 4,
      comment: "Great quality and fast delivery. The Sausage Delight exceeded my expectations!",
      date: "3 days ago"
    }
  ];

  return (
    <div className="font-sans bg-gray-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-lg sticky top-0 z-50">
        <div className="text-orange-500 font-bold text-2xl">PizzaZone</div>
        <ul className="flex space-x-8 font-medium">
          <li className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => navigate('/')}>Home</li>
          <li className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => navigate('/menu')}>Shop</li>
          <li className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => handleScroll('about')}>About Us</li>
          <li className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => handleScroll('contact')}>Contact</li>
        </ul>
        <div className="flex space-x-4">
          <Bell className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => navigate('/notifications')} />
          <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
            <ShoppingCart className="hover:text-orange-500 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <User
            className="cursor-pointer hover:text-orange-500 transition-colors"
            onClick={() => {
              if (isAuthenticated) {
                navigate('/profile');
              } else {
                navigate('/signin');
              }
            }}
          />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-yellow-50 py-12 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Text Content on the Left */}
          <div className="text-center lg:text-left flex-1 lg:flex-shrink-0 lg:w-1/2">
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
              Delicious <span className="text-orange-500">Pizza</span> 
              <br />Delivered to You
            </h1>

            <p className="mb-8 text-gray-700 text-lg lg:text-xl font-medium leading-relaxed max-w-2xl">
              Experience the best flavors in town. Fresh ingredients, fast delivery, and unforgettable taste that will keep you coming back for more.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => navigate('/signin')} 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Started
              </button>
              <button 
                onClick={() => navigate('/menu')} 
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Order Now
              </button>
            </div>
          </div>

          {/* Image on the Right */}
          <div className="flex-1 lg:flex-shrink-0 lg:w-1/2 flex justify-center items-center">
            <img 
              src="pizza.png" 
              alt="Delicious Pizza" 
              className="w-full max-w-md lg:max-w-2xl xl:max-w-3xl object-contain drop-shadow-2xl animate-float" 
            />
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">OUR MENU</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative flex flex-col border border-orange-100">
                {/* Decorative orange corner */}
                <div className="absolute top-0 left-0 w-8 h-8 bg-orange-400 rounded-br-xl shadow-lg"></div>
                {/* Pizza Image */}
                <div className="w-full flex justify-center items-center pt-6">
                  <img
                    src={process.env.PUBLIC_URL + '/' + item.img}
                    alt={item.name}
                    className="w-24 h-24 object-contain"
                    onError={e => { e.target.onerror = null; e.target.src = process.env.PUBLIC_URL + '/pizza.png'; }}
                  />
                </div>
                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-extrabold text-orange-500 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="text-base text-gray-600 font-semibold">0.0</span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-base mb-2 font-medium">{item.description}</p>
                  {/* Ingredients visually enhanced */}
                  <div className="mb-3">
                    <span className="text-xs text-orange-500 font-bold uppercase tracking-wide">INGREDIENTS:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.name === 'Sausage Delight' && [
                        <span key="masala" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Spicy veggie masala</span>,
                        <span key="onions" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Onions</span>,
                        <span key="tomato" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Tomato</span>,
                        <span key="cheese" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Cheese</span>
                      ]}
                      {item.name === 'Margherita' && [
                        <span key="sauce" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Tomato sauce</span>,
                        <span key="cream" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Cream cheese</span>,
                        <span key="tomato" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Tomato</span>
                      ]}
                      {item.name === 'Chilli Chicken Pizza' && [
                        <span key="chicken" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Chicken</span>,
                        <span key="masala" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Spicy veggie masala</span>,
                        <span key="onions" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Onions</span>,
                        <span key="tomato" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Tomato</span>,
                        <span key="cheese" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Cheese</span>
                      ]}
                      {item.name === 'Veggie Masala Pizza' && [
                        <span key="masala" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Spicy veggie masala</span>,
                        <span key="onions" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Onions</span>,
                        <span key="tomato" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Tomato</span>,
                        <span key="cheese" className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">Cheese</span>
                      ]}
                    </div>
                  </div>
                  {/* Size and Quantity Controls */}
                  <div className="flex gap-2 mb-3">
                    {[
                      { short: 'S', full: 'Small' },
                      { short: 'M', full: 'Medium' },
                      { short: 'L', full: 'Large' }
                    ].map((size) => (
                      <button
                        key={size.short}
                        onClick={() => handleSizeSelect(item.id, size.full)}
                        className={`px-3 py-1 rounded-lg bg-slate-800 text-white text-xs font-bold shadow ${selectedSizes[item.id] === size.full ? 'bg-orange-500 scale-105' : 'hover:bg-orange-400'}`}
                      >
                        {size.short}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <button className="bg-slate-800 text-white px-3 py-1 rounded-lg text-lg font-bold shadow" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    <span className="text-slate-800 font-extrabold text-lg bg-orange-100 px-3 py-1 rounded-lg shadow">{quantities[item.id] || 1}</span>
                    <button className="bg-slate-800 text-white px-3 py-1 rounded-lg text-lg font-bold shadow" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                    <span className="text-orange-500 font-extrabold text-lg ml-2">LKR {item.price}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Starting from</span>
                      <span className="text-lg font-extrabold text-orange-500">LKR {item.price}</span>
                    </div>
                    <button 
                      onClick={() => addToCart(item)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition text-lg disabled:opacity-50"
                      disabled={loading[item.id]}
                    >
                      <ShoppingCart size={18} />
                      {loading[item.id] ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button 
              onClick={() => navigate('/menu')} 
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Show All
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">YOUR FAVORITE FOOD DELIVERY PARTNER</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <img src="order.png" alt="Easy Order" className="mx-auto mb-6 h-32 w-32 object-contain group-hover:scale-110 transition-transform duration-300" />
                <h4 className="font-bold text-xl mb-3 text-gray-800">Easy to Order</h4>
                <p className="text-gray-600 leading-relaxed">Simple steps to place your order online. Our intuitive interface makes ordering a breeze.</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <img src="delivery.png" alt="Fast Delivery" className="mx-auto mb-6 h-32 w-32 object-contain group-hover:scale-110 transition-transform duration-300" />
                <h4 className="font-bold text-xl mb-3 text-gray-800">Fastest Delivery</h4>
                <p className="text-gray-600 leading-relaxed">Hot and fresh delivery to your door. We guarantee your pizza arrives piping hot and on time.</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <img src="received.png" alt="Best Quality" className="mx-auto mb-6 h-32 w-32 object-contain group-hover:scale-110 transition-transform duration-300" />
                <h4 className="font-bold text-xl mb-3 text-gray-800">Best Quality</h4>
                <p className="text-gray-600 leading-relaxed">Maintained hygiene and consistent quality. We use only the finest ingredients for every pizza.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Image on the left */}
            <div className="flex-1 flex justify-center">
              <img
                src="5.png"
                alt="Happy Customers"
                className="w-full max-w-md object-contain drop-shadow-xl"
              />
            </div>

            {/* Reviews on the right */}
            <div className="flex-1">
              <h3 className="font-bold text-3xl mb-8 text-gray-800">What Our Customers Say About Us</h3>
              <div className="space-y-6">
                {customerReviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg text-gray-800">{review.name}</h4>
                      <div className="flex items-center space-x-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2 italic">"{review.comment}"</p>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">CONTACT US</h2>
          <p className="mb-12 text-gray-600 text-center text-lg">Have a question or feedback? We'd love to hear from you!</p>
          <form className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300" 
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300" 
              />
            </div>
            <textarea 
              placeholder="Your Message" 
              rows="6" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 mb-6"
            ></textarea>
            <div className="text-center">
              <button 
                type="submit" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-4 font-bold text-2xl text-orange-500">PizzaZone</div>
          <div className="flex justify-center space-x-8 mb-6">
            <a href="#" className="hover:text-orange-500 transition-colors">About Us</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Terms</a>
          </div>
          <p className="text-gray-400">&copy; 2025 PizzaZone. All rights reserved.</p>
        </div>
      </footer>

      {cartMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {cartMessage}
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MainPage;