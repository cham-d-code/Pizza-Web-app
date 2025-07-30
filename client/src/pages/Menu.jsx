import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Heart, ShoppingCart, Plus, Clock, Flame, Leaf, Award } from 'lucide-react';

// Add Montserrat font
const montserratStyle = {
  fontFamily: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
};

const Menu = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [addingToCart, setAddingToCart] = useState(new Set());

  // Categories from your backend
  const categories = ['All', 'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten-Free', 'Spicy', 'Gourmet'];

  // Mock user ID for testing
  const userId = 'mock-user-id';

  useEffect(() => {
    fetchPizzas();
  }, [selectedCategory, searchQuery, sortBy]);

  const fetchPizzas = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:5000/api/pizzas';
      
      // Add category filter
      if (selectedCategory !== 'All') {
        url = `http://localhost:5000/api/pizzas/category/${selectedCategory}`;
      }
      
      // Add search query
      if (searchQuery.trim()) {
        url = `http://localhost:5000/api/pizzas/search?q=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        let pizzaList = data.pizzas || data || [];
        
        // Apply price filter
        pizzaList = pizzaList.filter(pizza => {
          const basePrice = pizza.sizes?.Medium?.price || pizza.basePrice || 0;
          return basePrice >= priceRange[0] && basePrice <= priceRange[1];
        });
        
        // Apply sorting
        pizzaList = sortPizzas(pizzaList, sortBy);
        
        setPizzas(pizzaList);
      }
    } catch (error) {
      console.error('Error fetching pizzas:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortPizzas = (pizzaList, sortBy) => {
    switch (sortBy) {
      case 'price-low':
        return pizzaList.sort((a, b) => (a.sizes?.Medium?.price || a.basePrice || 0) - (b.sizes?.Medium?.price || b.basePrice || 0));
      case 'price-high':
        return pizzaList.sort((a, b) => (b.sizes?.Medium?.price || b.basePrice || 0) - (a.sizes?.Medium?.price || a.basePrice || 0));
      case 'rating':
        return pizzaList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'name':
        return pizzaList.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return pizzaList.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
  };

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
        // Show success message or update cart count
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
    const basePrice = pizza.sizes?.Medium?.price || pizza.basePrice || 0;
    const isLoading = addingToCart.has(`${pizza._id}-Medium`);
    const isFavorite = favorites.has(pizza._id);

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
        {/* Pizza Image */}
        <div className="relative overflow-hidden">
          <img
            src={pizza.image || '/api/placeholder/400/300'}
            alt={pizza.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {pizza.featured && (
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Award className="h-3 w-3" />
                Featured
              </span>
            )}
            {pizza.isVegetarian && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Leaf className="h-3 w-3" />
                Veg
              </span>
            )}
            {pizza.spiceLevel === 'Hot' && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Flame className="h-3 w-3" />
                Spicy
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(pizza._id)}
            className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-50 transition-colors"
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-orange-500 text-orange-500' : 'text-gray-400'}`} 
            />
          </button>

          {/* Quick Add Button */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => addToCart(pizza)}
              disabled={isLoading}
              className="bg-orange-600 text-white rounded-full p-2 hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Pizza Details */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
              {pizza.name}
            </h3>
            {pizza.cookTime && (
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {pizza.cookTime}
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {pizza.description}
          </p>

          {/* Rating */}
          {pizza.rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700 ml-1">
                  {pizza.rating}
                </span>
              </div>
              <span className="text-gray-400 text-sm">
                ({pizza.reviews || 0} reviews)
              </span>
            </div>
          )}

          {/* Size Options */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Available Sizes:</p>
            <div className="flex gap-2">
              {pizza.sizes && Object.entries(pizza.sizes).map(([size, details]) => (
                <div key={size} className="text-center">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="text-xs font-medium text-gray-600">{size}</p>
                    <p className="text-sm font-bold text-orange-600">
                      LKR {details.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Allergens */}
          {pizza.allergens && pizza.allergens.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Contains:</p>
              <div className="flex flex-wrap gap-1">
                {pizza.allergens.map(allergen => (
                  <span key={allergen} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(pizza)}
            disabled={isLoading || !pizza.available}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            {isLoading ? 'Adding...' : !pizza.available ? 'Out of Stock' : `Add to Cart - LKR ${basePrice.toLocaleString()}`}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={montserratStyle}>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 font-medium">Loading our delicious pizzas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={montserratStyle}>
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
              className="flex items-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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
                      max="5000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="5000"
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
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setPriceRange([0, 5000]);
                }}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {pizzas.map(pizza => (
              <PizzaCard key={pizza._id} pizza={pizza} />
            ))}
          </div>
        )}
      </div>

      {/* Load More Button (if you want pagination) */}
      {pizzas.length > 0 && (
        <div className="text-center pb-8">
          <button className="bg-white text-orange-600 border-2 border-orange-600 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold">
            Load More Pizzas
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;