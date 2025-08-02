import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, Leaf, Wheat, Heart, ShoppingCart, ChevronLeft, ChevronRight, User, LogOut, Menu, X } from 'lucide-react';

const PizzaMenu = () => {
  const [pizzas, setPizzas] = useState([]);
  const [featuredPizzas, setFeaturedPizzas] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
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
    sortBy: 'newest',
    page: 1,
    limit: 12
  });

  const [showFilters, setShowFilters] = useState(false);
  const [activeView, setActiveView] = useState('all'); // 'all', 'featured', 'category'

  // API base URL - adjust this to match your backend
  const API_BASE = 'http://localhost:5000/api';

  // Mock user state - replace with actual auth logic
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you'd validate the token and get user info
      setUser({ name: 'John Doe', email: 'john@example.com' });
    }
  }, []);
  

  // Fetch pizzas based on current filters
  const fetchPizzas = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`${API_BASE}/pizzas?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setPizzas(data.data);
        setPagination(data.pagination);
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
    fetchPizzas();
  }, [filters]);

  useEffect(() => {
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

  // Handle pagination
  const handlePageChange = (newPage) => {
    handleFilterChange('page', newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-orange-100 shadow-md relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-orange-500">PizzaZone</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <a href="/main" className="text-gray-700 hover:text-orange-500 font-semibold text-lg transition">HOME</a>
            <a href="/menu" className="text-orange-500 font-semibold text-lg">SHOP</a>
            <a href="/main" className="text-gray-700 hover:text-orange-500 font-semibold text-lg transition">ABOUT US</a>
            <a href="/main" className="text-gray-700 hover:text-orange-500 font-semibold text-lg transition">CONTACT</a>
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-orange-500 transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="/notifications"/>
              </svg>
            </button>
            <button className="text-gray-700 hover:text-orange-500 transition relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
            </button>
            {user ? (
              <div className="flex items-center space-x-2">
                <button className="text-gray-700 hover:text-orange-500 transition">
                  <User size={24} />
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-orange-500 transition"
                >
                  <LogOut size={24} />
                </button>
              </div>
            ) : (
              <button className="text-gray-700 hover:text-orange-500 transition">
                <User size={24} />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-orange-500 transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-orange-200 py-4">
            <div className="flex flex-col space-y-3">
              <a href="/" className="text-gray-700 hover:text-orange-500 font-semibold transition px-2 py-1">HOME</a>
              <a href="/menu" className="text-orange-500 font-semibold px-2 py-1">SHOP</a>
              <a href="/about" className="text-gray-700 hover:text-orange-500 font-semibold transition px-2 py-1">ABOUT US</a>
              <a href="/contact" className="text-gray-700 hover:text-orange-500 font-semibold transition px-2 py-1">CONTACT</a>
              
              <div className="border-t border-orange-200 pt-3 mt-3">
                <div className="flex items-center justify-center space-x-6">
                  <button className="text-gray-700 hover:text-orange-500 transition">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                    </svg>
                  </button>
                  <button className="text-gray-700 hover:text-orange-500 transition relative">
                    <ShoppingCart size={24} />
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
                  </button>
                  {user ? (
                    <>
                      <button className="text-gray-700 hover:text-orange-500 transition">
                        <User size={24} />
                      </button>
                      <button
                        onClick={handleLogout}
                        className="text-gray-700 hover:text-orange-500 transition"
                      >
                        <LogOut size={24} />
                      </button>
                    </>
                  ) : (
                    <button className="text-gray-700 hover:text-orange-500 transition">
                      <User size={24} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  // Pizza Card Component
  const PizzaCard = ({ pizza }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group bg-opacity-90">
      <div className="relative">
        <img
          src={pizza.image || '/api/placeholder/300/200'}
          alt={pizza.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {pizza.isVegetarian && (
            <span className="bg-green-500 text-white p-1 rounded-full">
              <Leaf size={12} />
            </span>
          )}
          {pizza.isVegan && (
            <span className="bg-emerald-500 text-white p-1 rounded-full">
              <Heart size={12} />
            </span>
          )}
          {pizza.isGlutenFree && (
            <span className="bg-amber-500 text-white p-1 rounded-full">
              <Wheat size={12} />
            </span>
          )}
        </div>
        {pizza.isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-500 transition-colors">
            {pizza.name}
          </h3>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {pizza.rating?.average?.toFixed(1) || 'N/A'}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {pizza.description}
        </p>
        
        <div className="mb-3">
          <span className="text-xs text-gray-500 font-medium">Ingredients:</span>
          <p className="text-xs text-gray-600 mt-1">
            {pizza.ingredients?.join(', ')}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {pizza.tags?.map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Starting from</span>
            <span className="text-lg font-bold text-orange-500">
              ${getMinPrice(pizza.sizes).toFixed(2)}
            </span>
          </div>
          <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 transition">
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  

  return (
    <div className="min-h-screen font-sans" style={{ 
      background: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url("/bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
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
            {featuredPizzas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredPizzas.map((pizza) => (
                  <PizzaCard key={pizza._id} pizza={pizza} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No featured pizzas available</p>
              </div>
            )}
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
                    Showing {pizzas.length} of {pagination.totalPizzas || 0} pizzas
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {pizzas.map((pizza) => (
                    <PizzaCard key={pizza._id} pizza={pizza} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="flex items-center gap-1 px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-100 bg-white bg-opacity-90 transition"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = pagination.currentPage <= 3 
                          ? i + 1 
                          : pagination.currentPage + i - 2;
                        
                        if (pageNum > pagination.totalPages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 rounded font-semibold transition ${
                              pageNum === pagination.currentPage
                                ? 'bg-orange-400 text-white'
                                : 'border bg-white bg-opacity-90 hover:bg-orange-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="flex items-center gap-1 px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-100 bg-white bg-opacity-90 transition"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
                
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