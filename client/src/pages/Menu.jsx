import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Heart, ShoppingCart, Clock, Flame, Leaf, AlertCircle, RefreshCw, Info, Bell, User } from 'lucide-react';

// Add Montserrat font
const montserratStyle = {
  fontFamily: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
};

const Menu = () => {
  const navigate = useNavigate();
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [addingToCart, setAddingToCart] = useState(new Set());
  const [showDebug, setShowDebug] = useState(true); // Always show debug initially

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  // Categories from your backend
  const categories = ['All', 'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten-Free', 'Spicy', 'Gourmet'];

  // Mock user ID for testing
  const userId = 'mock-user-id';

  const sortPizzas = useCallback((pizzaList, sortBy) => {
    switch (sortBy) {
      case 'price-low':
        return pizzaList.sort((a, b) => getPizzaPrice(a) - getPizzaPrice(b));
      case 'price-high':
        return pizzaList.sort((a, b) => getPizzaPrice(b) - getPizzaPrice(a));
      case 'rating':
        return pizzaList.sort((a, b) => {
          const aRating = typeof a.rating === 'object' ? a.rating.average || 0 : a.rating || 0;
          const bRating = typeof b.rating === 'object' ? b.rating.average || 0 : b.rating || 0;
          return bRating - aRating;
        });
      case 'name':
        return pizzaList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      default:
        return pizzaList.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
  }, []);

  const fetchPizzas = useCallback(async () => {
    const baseUrl = 'http://localhost:5000/api/pizzas';
    const params = new URLSearchParams();
    try {
      setLoading(true);
      setError(null);
      setDebugInfo(null);

      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

      console.log('🚀 Fetching from URL:', url);

      const response = await fetch(url);
      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📦 Raw API Response:', data);

      // Enhanced data parsing - try multiple possible structures
      let pizzaList = [];
      
      if (Array.isArray(data)) {
        pizzaList = data;
        console.log('✅ Data is direct array');
      } else if (data.data && Array.isArray(data.data)) {
        pizzaList = data.data;
        console.log('✅ Data found in data.data array');
      } else if (data.pizzas && Array.isArray(data.pizzas)) {
        pizzaList = data.pizzas;
        console.log('✅ Data found in data.pizzas array');
      } else if (data.results && Array.isArray(data.results)) {
        pizzaList = data.results;
        console.log('✅ Data found in data.results array');
      } else {
        console.log('❌ No array found in response');
        pizzaList = [];
      }

      console.log('🍕 Parsed pizza list:', pizzaList);
      console.log('📊 Pizza count before filtering:', pizzaList.length);

      const filteredPizzas = pizzaList.filter(pizza => {
        const price = getPizzaPrice(pizza);
        const passesFilter = price >= priceRange[0] && price <= priceRange[1];
        if (!passesFilter) {
          console.log(`🚫 Pizza "${pizza.name}" filtered out - price: ${price}, range: ${priceRange[0]}-${priceRange[1]}`);
        }
        return passesFilter;
      });

      console.log('🔍 Pizza count after filtering:', filteredPizzas.length);

      const sortedPizzas = sortPizzas(filteredPizzas, sortBy);
      setPizzas(sortedPizzas);

      // Enhanced debug info
      setDebugInfo({
        url,
        responseStatus: response.status,
        responseOk: response.ok,
        rawDataType: typeof data,
        isDataArray: Array.isArray(data),
        hasDataProperty: !!data.data,
        hasPizzasProperty: !!data.pizzas,
        hasResultsProperty: !!data.results,
        rawDataKeys: typeof data === 'object' ? Object.keys(data) : [],
        pizzaCount: sortedPizzas.length,
        originalCount: pizzaList.length,
        filteredCount: filteredPizzas.length,
        firstPizza: sortedPizzas[0] || pizzaList[0] || null,
        fullResponse: data,
        priceRange: priceRange,
        searchQuery: searchQuery,
        selectedCategory: selectedCategory
      });
    } catch (err) {
      console.error('💥 Error:', err);
      setError(err.message);
      setDebugInfo({
        error: err.message,
        stack: err.stack,
        url: baseUrl
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, sortBy, priceRange, sortPizzas]);

  // Helper function to get pizza price with better logic
  const getPizzaPrice = (pizza) => {
    if (!pizza) return 0;
    
    // Try different price sources
    if (pizza.sizes && typeof pizza.sizes === 'object') {
      // If sizes is an array
      if (Array.isArray(pizza.sizes)) {
        const mediumSize = pizza.sizes.find(s => 
          s.size && s.size.toLowerCase().includes('medium')
        );
        if (mediumSize && mediumSize.price) return mediumSize.price;
        // Fall back to first size
        if (pizza.sizes[0] && pizza.sizes[0].price) return pizza.sizes[0].price;
      } else {
        // If sizes is an object
        const mediumSizeObj = pizza.sizes.Medium || pizza.sizes.medium || pizza.sizes.M;
        if (mediumSizeObj) {
          return typeof mediumSizeObj === 'object' ? mediumSizeObj.price || 0 : mediumSizeObj;
        }
        // Get first available size
        const firstSize = Object.values(pizza.sizes)[0];
        if (firstSize) {
          return typeof firstSize === 'object' ? firstSize.price || 0 : firstSize;
        }
      }
    }
    
    // Fall back to direct price properties
    return pizza.price || pizza.basePrice || pizza.cost || 0;
  };

  useEffect(() => {
    fetchPizzas();
  }, [fetchPizzas]);


  const addToCart = async (pizza, size = 'Medium') => {
    const cartKey = `${pizza._id}-${size}`;
    setAddingToCart(prev => new Set(prev).add(cartKey));
    
    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pizzaId: pizza._id,
          size: size,
          quantity: 1
        })
      });

      if (response.ok) {
        console.log('Added to cart successfully');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartKey);
        return newSet;
      });
    }
  };

  const toggleFavorite = (pizzaId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(pizzaId)) {
        newFavorites.delete(pizzaId);
      } else {
        newFavorites.add(pizzaId);
      }
      return newFavorites;
    });
  };

  const PizzaCard = ({ pizza }) => {
    const basePrice = getPizzaPrice(pizza);
    const isLoading = addingToCart.has(`${pizza._id}-Medium`);
    const isFavorite = favorites.has(pizza._id);

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group max-w-sm mx-auto">
        {/* Pizza Image */}
        <div className="relative overflow-hidden">
          <img
            src={pizza.image || `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center`}
            alt={pizza.name || 'Pizza'}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center`;
            }}
          />
          
          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(pizza._id)}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
            />
          </button>

          {/* Badges */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            {pizza.isVegetarian && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Leaf className="h-3 w-3" />
              </span>
            )}
            {pizza.spiceLevel === 'Hot' && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Flame className="h-3 w-3" />
              </span>
            )}
          </div>
        </div>

        {/* Pizza Details */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
            {pizza.name || 'Unnamed Pizza'}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
            {pizza.description || "Delicious handcrafted pizza made with fresh ingredients"}
          </p>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center">
              <div className="flex items-center bg-orange-50 px-2 py-1 rounded-lg">
                <Star className="h-3 w-3 fill-orange-400 text-orange-400 mr-1" />
                <span className="text-sm font-semibold text-orange-600">
                  {typeof pizza.rating === 'object' ? (pizza.rating.average || 4.5).toFixed(1) : (pizza.rating || 4.5)}
                </span>
              </div>
            </div>
            
            <span className="text-gray-500 text-xs">
              ({typeof pizza.rating === 'object' ? pizza.rating.count || 0 : pizza.reviews || Math.floor(Math.random() * 100) + 10})
            </span>

            {pizza.cookTime && (
              <div className="flex items-center text-gray-500 text-xs ml-auto">
                <Clock className="h-3 w-3 mr-1" />
                {pizza.cookTime}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                LKR {basePrice.toLocaleString()}
              </span>
              {pizza.sizes && Object.keys(pizza.sizes).length > 1 && (
                <span className="text-gray-500 text-sm ml-1">onwards</span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(pizza)}
            disabled={isLoading || !pizza.available}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Adding...
              </>
            ) : !pizza.available ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={montserratStyle}>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 font-medium">Loading our delicious pizzas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={montserratStyle}>
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">
            Unable to load pizzas. Please check if your backend server is running on port 5000.
          </p>
          <p className="text-sm text-red-600 mb-4 font-mono bg-red-50 p-2 rounded">
            {error}
          </p>
          <button
            onClick={fetchPizzas}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-5 w-5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={montserratStyle}>
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

      {/* Enhanced Debug Panel */}
      {debugInfo && showDebug && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="text-sm">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-blue-800">🔍 Debug Information</h4>
              <button
                onClick={() => setShowDebug(false)}
                className="text-blue-600 hover:text-blue-800 text-xs"
              >
                Hide Debug
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>API URL:</strong> {debugInfo.url}</p>
                <p><strong>Response Status:</strong> 
                  <span className={debugInfo.responseOk ? 'text-green-600' : 'text-red-600'}>
                    {debugInfo.responseStatus} {debugInfo.responseOk ? '✅' : '❌'}
                  </span>
                </p>
                <p><strong>Raw Data Type:</strong> {debugInfo.rawDataType}</p>
                <p><strong>Available Keys:</strong> {debugInfo.rawDataKeys?.join(', ') || 'None'}</p>
              </div>
              
              <div>
                <p><strong>Original Count:</strong> {debugInfo.originalCount}</p>
                <p><strong>After Filtering:</strong> {debugInfo.filteredCount}</p>
                <p><strong>Final Count:</strong> {debugInfo.pizzaCount}</p>
                <p><strong>Price Range:</strong> {debugInfo.priceRange?.join(' - ')}</p>
              </div>
            </div>

            {debugInfo.firstPizza && (
              <details className="mt-2">
                <summary className="cursor-pointer font-medium text-blue-700">First Pizza Data Structure</summary>
                <pre className="bg-white p-2 rounded mt-2 text-xs overflow-auto max-h-40">
                  {JSON.stringify(debugInfo.firstPizza, null, 2)}
                </pre>
              </details>
            )}
            
            <details className="mt-2">
              <summary className="cursor-pointer font-medium text-blue-700">Full API Response</summary>
              <pre className="bg-white p-2 rounded mt-2 text-xs overflow-auto max-h-40">
                {JSON.stringify(debugInfo.fullResponse, null, 2)}
              </pre>
            </details>
            
            <div className="mt-3 flex gap-2 flex-wrap">
              <button
                onClick={() => window.open('http://localhost:5000/api/pizzas', '_blank')}
                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
              >
                🌐 Test API
              </button>
              <button
                onClick={fetchPizzas}
                className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
              >
                🔄 Retry
              </button>
              <button
                onClick={() => {
                  setPriceRange([0, 10000]);
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700"
              >
                🗑️ Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {!showDebug && debugInfo && (
        <div className="bg-blue-100 p-2 mb-4">
          <button
            onClick={() => setShowDebug(true)}
            className="flex items-center gap-2 text-blue-800 hover:text-blue-900 text-sm"
          >
            <Info className="h-4 w-4" />
            Show Debug Info (Found {debugInfo.pizzaCount} pizzas)
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Our Menu</h1>
              <p className="text-gray-600 mt-2">Discover our handcrafted pizzas made with love</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Found {pizzas.length} pizzas</p>
              {debugInfo && (
                <p className="text-xs text-blue-500">
                  (Original: {debugInfo.originalCount}, Filtered: {debugInfo.filteredCount})
                </p>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for pizzas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">A-Z</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: LKR {priceRange[0]} - LKR {priceRange[1]}
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pizza Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {pizzas.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No pizzas found</h3>
              <p className="text-gray-600 mb-4">
                {debugInfo && debugInfo.originalCount > 0 
                  ? `Found ${debugInfo.originalCount} pizzas but they were filtered out. Try adjusting your filters.`
                  : "No pizzas returned from the API. Check your backend data."
                }
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setPriceRange([0, 10000]);
                }}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pizzas.map((pizza, index) => (
              <PizzaCard key={pizza._id || pizza.id || index} pizza={pizza} />
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {pizzas.length > 0 && (
        <div className="text-center pb-8">
          <button className="bg-white text-orange-500 border-2 border-orange-500 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold">
            Load More Pizzas
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;