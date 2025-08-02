import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShoppingCart, User, Star, Minus, Plus } from 'lucide-react';

const MainPage = () => {
  const navigate = useNavigate();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});

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

  const menuItems = [
    { 
      id: 1,
      name: 'Sausage Delight', 
      price: '2900.00', 
      img: 'sausage.jpg',
      description: 'Made with spicy veggie masala, onions, tomato & cheese'
    },
    { 
      id: 2,
      name: 'Margherita', 
      price: '2500.00',
      img: 'margherita.jpg',
      description: 'Rich tomato sauce base topped with cream cheese, tomato'
    },
    { 
      id: 3,
      name: 'Chilli Chicken Pizza', 
      price: '2900.00',
      img: 'chilli.jpg',
      description: 'Made with spicy veggie masala, onions, tomato & cheese'
    },
    { 
      id: 4,
      name: 'Veggie Masala Pizza', 
      price: '2980.00', 
      img: 'veggie.jpg',
      description: 'Made with spicy veggie masala, onions, tomato & cheese'
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
          <ShoppingCart className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => navigate('/cart')} />
          <User className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => navigate('/profile')} />
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
              <div key={item.id} className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Image Section */}
                <div className="relative h-64 bg-gray-300">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content Section */}
                <div className="p-6 bg-gray-800 text-white">
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                  
                  {/* Size Selection */}
                  <div className="flex space-x-2 mb-4">
                    {['S', 'M', 'L'].map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(item.id, size)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          selectedSizes[item.id] === size
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-white font-semibold">{quantities[item.id] || 1}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-xl font-bold text-orange-400">LKR {item.price}</span>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors duration-300">
                    Add To Cart Now
                  </button>
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

      <style jsx>{`
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