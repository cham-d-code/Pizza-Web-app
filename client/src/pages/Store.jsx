import React, { useState, useEffect } from 'react';
import { Search, Star, Heart, ShoppingCart, Leaf, Wheat, Minus, Plus, Clock, User } from 'lucide-react';

const Store = () => {
  const [pizzas, setPizzas] = useState([]);
  const [featuredPizzas, setFeaturedPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPizzas();
  }, [searchQuery]);

  useEffect(() => {
    fetchFeaturedPizzas();
  }, []);

  const fetchPizzas = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/pizzas';
      if (searchQuery.trim()) {
        url += `?search=${encodeURIComponent(searchQuery.trim())}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setPizzas(data.data || []);
    } catch (err) {
      setError('Failed to fetch pizzas');
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured pizzas
  const fetchFeaturedPizzas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pizzas/featured');
      const data = await response.json();
      if (data.success) {
        setFeaturedPizzas(data.data);
      }
    } catch (err) {
      console.error('Featured pizzas error:', err);
    } finally {
      setFeaturedLoading(false);
    }
  };

  // Add to cart function
  const addToCart = async (pizza, size, quantity) => {
    setAddingToCart(true);
    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-user-id'
        },
        body: JSON.stringify({
          pizzaId: pizza._id,
          size: size,
          quantity: quantity,
          customizations: {}
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCartMessage({ type: 'success', text: `${pizza.name} added to cart!` });
        setTimeout(() => setCartMessage({ type: '', text: '' }), 3000);
      } else {
        setCartMessage({ type: 'error', text: data.message || 'Failed to add to cart' });
        setTimeout(() => setCartMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartMessage({ type: 'error', text: 'Failed to add to cart' });
      setTimeout(() => setCartMessage({ type: '', text: '' }), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const getMinPrice = (sizes) => {
    if (!sizes || sizes.length === 0) return 0;
    return Math.min(...sizes.map(size => size.price));
  };

  const PizzaCard = ({ pizza }) => {
    const [selectedSize, setSelectedSize] = useState(pizza.sizes && pizza.sizes[0] ? pizza.sizes[0].size : 'M');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const sizeObj = pizza.sizes ? pizza.sizes.find(s => s.size === selectedSize) : null;
    const totalPrice = sizeObj ? sizeObj.price * quantity : 0;
    const minPrice = getMinPrice(pizza.sizes);

    const handleAddToCart = async () => {
      setLoading(true);
      await addToCart(pizza, selectedSize, quantity);
      setLoading(false);
    };

    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group bg-opacity-95 border-2 border-orange-100 relative">
        {/* Pizza Image with overlay */}
        <div className="relative">
          <img
            src={pizza.image || '/api/placeholder/300/200'}
            alt={pizza.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-xl"
            style={{ filter: 'brightness(0.95)' }}
          />
          {/* Dietary icons */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {pizza.isVegetarian && (
              <span className="bg-green-500 text-white p-1 rounded-full shadow">
                <Leaf size={14} />
              </span>
            )}
            {pizza.isVegan && (
              <span className="bg-emerald-500 text-white p-1 rounded-full shadow">
                <Heart size={14} />
              </span>
            )}
            {pizza.isGlutenFree && (
              <span className="bg-amber-500 text-white p-1 rounded-full shadow">
                <Wheat size={14} />
              </span>
            )}
          </div>
          {pizza.isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                Featured
              </span>
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-extrabold text-gray-800 group-hover:text-orange-500 transition-colors">
              {pizza.name}
            </h3>
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="text-base text-gray-600 font-semibold">
                {pizza.rating?.average?.toFixed(1) || '0.0'}
              </span>
            </div>
          </div>
          <p className="text-gray-700 text-base mb-2 font-medium">
            {pizza.description}
          </p>
          {/* Ingredients visually enhanced */}
          <div className="mb-3">
            <span className="text-xs text-orange-500 font-bold uppercase tracking-wide">Ingredients:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {(pizza.ingredients && pizza.ingredients.length > 0)
                ? pizza.ingredients.map((ing, idx) => (
                    <span key={idx} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 shadow-sm">
                      {ing}
                    </span>
                  ))
                : <span className="text-xs text-gray-400">Not specified</span>
              }
            </div>
          </div>
          {/* Tags visually enhanced */}
          <div className="flex flex-wrap gap-1 mb-3">
            {pizza.tags?.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold border border-gray-300 shadow-sm">
                {tag}
              </span>
            ))}
          </div>
          {/* Size and Quantity Controls */}
          {pizza.sizes && pizza.sizes.length > 0 && (
            <div className="flex gap-2 mb-3">
              {pizza.sizes.map(size => (
                <button
                  key={size.size}
                  className={`px-3 py-1 rounded-lg bg-slate-800 text-white text-xs font-bold shadow ${selectedSize === size.size ? 'bg-orange-500 scale-105' : 'hover:bg-orange-400'}`}
                  onClick={() => setSelectedSize(size.size)}
                >
                  {size.size}
                </button>
              ))}
            </div>
          )}
          {pizza.sizes && pizza.sizes.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <button className="bg-slate-800 text-white px-3 py-1 rounded-lg text-lg font-bold shadow" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span className="text-slate-800 font-extrabold text-lg bg-orange-100 px-3 py-1 rounded-lg shadow">{quantity}</span>
              <button className="bg-slate-800 text-white px-3 py-1 rounded-lg text-lg font-bold shadow" onClick={() => setQuantity(q => q + 1)}>+</button>
              <span className="text-orange-500 font-extrabold text-lg ml-2">LKR {totalPrice}.00</span>
            </div>
          )}
          <div className="flex justify-between items-center mt-2">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Starting from</span>
              <span className="text-lg font-extrabold text-orange-500">
                {pizza.sizes ? `LKR ${minPrice}.00` : 'N/A'}
              </span>
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={loading || addingToCart}
              className={`bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg transition ${(loading || addingToCart) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading || addingToCart ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
        {/* Decorative corner accent */}
        <div className="absolute top-0 left-0 w-8 h-8 bg-orange-400 rounded-br-xl shadow-lg"></div>
      </div>
    );
  };

  // Navigation Component
  const Navigation = () => (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-lg sticky top-0 z-50">
      <div className="text-orange-500 font-bold text-2xl">PizzaZone</div>
      <ul className="flex space-x-8 font-medium">
        <li className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => window.location.href = '/'}>Home</li>
        <li className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => window.location.href = '/menu'}>Menu</li>
        <li className="cursor-pointer text-orange-500 font-semibold" onClick={() => window.location.href = '/store'}>Shop</li>
        <li className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => window.location.href = '/about'}>About Us</li>
        <li className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => window.location.href = '/contact'}>Contact</li>
      </ul>
      <div className="flex space-x-4">
        <button className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => window.location.href = '/notifications'}><Clock /></button>
        <button className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => window.location.href = '/cart'}><ShoppingCart /></button>
        <button className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => window.location.href = '/profile'}><User /></button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Cart Message */}
        {cartMessage.text && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold ${
            cartMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {cartMessage.text}
          </div>
        )}

        {/* Featured Pizzas Section */}
        {!searchQuery && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Featured Pizzas</h2>
              <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex-1 ml-6"></div>
            </div>
            {featuredLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading featured pizzas...</p>
              </div>
            ) : featuredPizzas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {featuredPizzas.map((pizza) => (
                  <PizzaCard key={pizza._id} pizza={pizza} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No featured pizzas available</p>
              </div>
            )}
          </div>
        )}

        {/* Search Bar */}
        <div className="flex items-center mb-6">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search for pizzas..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* All Pizzas Section */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Pizzas'}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pizzas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-600">{error}</div>
        ) : pizzas.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">
              {searchQuery ? 'No pizzas found matching your search.' : 'No pizzas found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pizzas.map(pizza => (
              <PizzaCard key={pizza._id} pizza={pizza} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
