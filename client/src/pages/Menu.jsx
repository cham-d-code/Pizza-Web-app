import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, Leaf, Wheat, Heart, ShoppingCart, ChevronLeft, ChevronRight, User, LogOut, Menu, X } from 'lucide-react';

const PizzaMenu = () => {
  const [pizzas, setPizzas] = useState([]);
  const [featuredPizzas, setFeaturedPizzas] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    isVegetarian: '',
    isVegan: '',
    isGlutenFree: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sortBy: 'newest'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [activeView, setActiveView] = useState('all'); // 'all', 'featured', 'category'

  // API base URL - adjust this to match your backend
  const API_BASE = 'http://localhost:5000/api';

  // Mock user state - replace with actual auth logic
  const [user, setUser] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ id: token, name: 'John Doe', email: 'john@example.com' });
    }
  }, []);

  // Add to cart function
  const addToCart = async (pizza, size, quantity) => {
    if (!user) {
      setCartMessage({ type: 'error', text: 'Please sign in to add items to cart' });
      setTimeout(() => setCartMessage({ type: '', text: '' }), 3000);
      return;
    }

    setAddingToCart(true);
    try {
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({
          pizzaId: pizza._id,
          size: size,
          quantity: quantity
        })
      });

      const data = await response.json();

      if (data.success) {
        setCartMessage({ type: 'success', text: 'Added to cart successfully!' });
      } else {
        setCartMessage({ type: 'error', text: data.message || 'Failed to add to cart' });
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      setCartMessage({ type: 'error', text: 'Failed to add to cart' });
    } finally {
      setAddingToCart(false);
      setTimeout(() => setCartMessage({ type: '', text: '' }), 3000);
    }
  };
  

  // Fetch all pizzas with current filters
  const fetchPizzas = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`${API_BASE}/pizzas?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setPizzas(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch pizzas');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured pizzas
  const fetchFeaturedPizzas = async () => {
    try {
      const response = await fetch(`${API_BASE}/pizzas/featured`);
      const data = await response.json();
      if (data.success) {
        setFeaturedPizzas(data.data);
      }
    } catch (err) {
      console.error('Featured pizzas error:', err);
    }
  };

  // Fetch category stats
  const fetchCategoryStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/pizzas/categories/stats`);
      const data = await response.json();
      if (data.success) {
        setCategoryStats(data.data);
      }
    } catch (err) {
      console.error('Category stats error:', err);
    }
  };

  useEffect(() => {
    if (activeView !== 'featured') {
      fetchPizzas();
    }
  }, [filters, activeView]);

  useEffect(() => {
    fetchPizzas();
    fetchFeaturedPizzas();
    fetchCategoryStats();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    handleFilterChange('search', searchTerm);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      isVegetarian: '',
      isVegan: '',
      isGlutenFree: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sortBy: 'newest',
      page: 1,
      limit: 12
    });
  };

  

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/signin';
  };

  // Get minimum price from sizes array
  const getMinPrice = (sizes) => {
    if (!sizes || sizes.length === 0) return 0;
    return Math.min(...sizes.map(size => size.price));
  };

  // Navigation Component (copied from Main.jsx)
  const Navigation = () => (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-lg sticky top-0 z-50">
      <div className="text-orange-500 font-bold text-2xl">PizzaZone</div>
      <ul className="flex space-x-8 font-medium">
        <li className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => window.location.href = '/'}>Home</li>
        <li className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => window.location.href = '/menu'}>Shop</li>
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

  // Pizza Card Component
  const PizzaCard = ({ pizza }) => {
    const [selectedSize, setSelectedSize] = useState(pizza.sizes && pizza.sizes[0] ? pizza.sizes[0].size : 'M');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const sizeObj = pizza.sizes ? pizza.sizes.find(s => s.size === selectedSize) : null;
    const totalPrice = sizeObj ? sizeObj.price * quantity : 0;

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
                {pizza.sizes ? `LKR ${getMinPrice(pizza.sizes)}.00` : 'N/A'}
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

  

  return (
    <div className="min-h-screen font-sans relative" style={{ 
      background: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url("/bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Toast Message */}
      {cartMessage.text && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-500 transform ${
          cartMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {cartMessage.text}
        </div>
      )}
      
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <div className="bg-white bg-opacity-90 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Menu</h1>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search pizzas, ingredients, or tags..."
              className="w-full pl-10 pr-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* View Toggle */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setActiveView('all')}
              className={`px-4 py-2 rounded font-semibold transition ${
                activeView === 'all' 
                  ? 'bg-orange-400 text-white' 
                  : 'bg-white bg-opacity-90 text-gray-700 hover:bg-orange-100'
              }`}
            >
              All Pizzas
            </button>
            <button
              onClick={() => setActiveView('featured')}
              className={`px-4 py-2 rounded font-semibold transition ${
                activeView === 'featured' 
                  ? 'bg-orange-400 text-white' 
                  : 'bg-white bg-opacity-90 text-gray-700 hover:bg-orange-100'
              }`}
            >
              Featured
            </button>
            {categoryStats.map((stat) => (
              <button
                key={stat.category}
                onClick={() => {
                  setActiveView('category');
                  handleFilterChange('category', stat.category);
                }}
                className={`px-4 py-2 rounded font-semibold transition ${
                  activeView === 'category' && filters.category === stat.category
                    ? 'bg-orange-400 text-white' 
                    : 'bg-white bg-opacity-90 text-gray-700 hover:bg-orange-100'
                }`}
              >
                {stat.category} ({stat.count})
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-90 hover:bg-orange-100 rounded transition"
            >
              <Filter size={16} />
              Filters
            </button>
            
            <div className="flex items-center gap-4">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="newest">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              
              {(filters.search || filters.category || filters.isVegetarian || filters.isVegan || filters.isGlutenFree || filters.minPrice || filters.maxPrice) && (
                <button
                  onClick={clearFilters}
                  className="text-orange-500 hover:text-orange-600 font-semibold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white bg-opacity-90 rounded">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">All Categories</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Specialty">Specialty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dietary
                  </label>
                  <div className="space-y-1">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.isVegetarian === 'true'}
                        onChange={(e) => handleFilterChange('isVegetarian', e.target.checked ? 'true' : '')}
                        className="mr-2 accent-orange-400"
                      />
                      <span className="text-sm">Vegetarian</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      checked={filters.isVegan === 'true'}
                      onChange={(e) => handleFilterChange('isVegan', e.target.checked ? 'true' : '')}
                      className="mr-2 accent-orange-400"
                    />
                    <span className="text-sm">Vegan</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      checked={filters.isGlutenFree === 'true'}
                      onChange={(e) => handleFilterChange('isGlutenFree', e.target.checked ? 'true' : '')}
                      className="mr-2 accent-orange-400"
                    />
                    <span className="text-sm">Gluten Free</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="$0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="$50"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Pizzas Section */}
        {activeView === 'featured' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Pizzas</h2>
            {/* Hardcoded featured pizzas for demo, replace with API if needed */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[{
                name: 'Sausage Delight',
                image: '/sausage.jpg',
                description: 'Made with spicy veggie masala, onions, tomato & cheese',
                ingredients: ['Spicy veggie masala', 'Onions', 'Tomato', 'Cheese'],
                sizes: [
                  { size: 'S', price: 1900 },
                  { size: 'M', price: 2900 },
                  { size: 'L', price: 3900 },
                ],
              },
              {
                name: 'Margherita',
                image: '/margherita.jpg',
                description: 'Rich tomato sauce base topped with cream cheese, tomato',
                ingredients: ['Tomato sauce', 'Cream cheese', 'Tomato'],
                sizes: [
                  { size: 'S', price: 1500 },
                  { size: 'M', price: 2500 },
                  { size: 'L', price: 3500 },
                ],
              },
              {
                name: 'Chilli Chicken Pizza',
                image: '/chilli.jpg',
                description: 'Made with spicy veggie masala, onions, tomato & cheese',
                ingredients: ['Chicken', 'Spicy veggie masala', 'Onions', 'Tomato', 'Cheese'],
                sizes: [
                  { size: 'S', price: 1900 },
                  { size: 'M', price: 2900 },
                  { size: 'L', price: 3900 },
                ],
              },
              {
                name: 'Veggie Masala Pizza',
                image: '/veggie.jpg',
                description: 'Made with spicy veggie masala, onions, tomato & cheese',
                ingredients: ['Spicy veggie masala', 'Onions', 'Tomato', 'Cheese'],
                sizes: [
                  { size: 'S', price: 1980 },
                  { size: 'M', price: 2980 },
                  { size: 'L', price: 3980 },
                ],
              }].map((pizza, idx) => (
                <PizzaCard key={idx} pizza={pizza} />
              ))}
            </div>
          </div>
        )}

        {/* Main Pizza Grid */}
        {(activeView === 'all' || activeView === 'category') && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading pizzas...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : pizzas.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {filters.category ? `${filters.category} Pizzas` : 'All Pizzas'}
                  </h2>
                  <p className="text-gray-600">
                    {pizzas.length} Pizza{pizzas.length !== 1 ? 's' : ''} Available
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {pizzas.map((pizza) => (
                    <PizzaCard key={pizza._id} pizza={{
                      ...pizza,
                      ingredients: pizza.ingredients || pizza.featuredIngredients || []
                    }} />
                  ))}
                </div>
                
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No pizzas found matching your criteria</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PizzaMenu;