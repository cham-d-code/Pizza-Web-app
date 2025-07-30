// controllers/pizzaController.js
const Pizza = require('../models/Pizza');

// @desc    Get all pizzas with filters
// @route   GET /api/pizzas
// @access  Public
const getAllPizzas = async (req, res) => {
  try {
    const {
      category,
      isVegetarian,
      isVegan,
      isGlutenFree,
      minPrice,
      maxPrice,
      search,
      sortBy,
      page = 1,
      limit = 12,
      isAvailable = true
    } = req.query;

    // Build filter object
    const filter = { isAvailable };

    if (category) filter.category = category;
    if (isVegetarian !== undefined) filter.isVegetarian = isVegetarian === 'true';
    if (isVegan !== undefined) filter.isVegan = isVegan === 'true';
    if (isGlutenFree !== undefined) filter.isGlutenFree = isGlutenFree === 'true';

    // Price range filter (check within sizes array)
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);
      filter['sizes.price'] = priceFilter;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    let sortOption = {};
    switch (sortBy) {
      case 'name':
        sortOption = { name: 1 };
        break;
      case 'price_low':
        sortOption = { 'sizes.price': 1 };
        break;
      case 'price_high':
        sortOption = { 'sizes.price': -1 };
        break;
      case 'rating':
        sortOption = { 'rating.average': -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const pizzas = await Pizza.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const totalPizzas = await Pizza.countDocuments(filter);
    const totalPages = Math.ceil(totalPizzas / Number(limit));

    res.json({
      success: true,
      data: pizzas,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalPizzas,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1
      }
    });

  } catch (error) {
    console.error('Get all pizzas error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single pizza by ID
// @route   GET /api/pizzas/:id
// @access  Public
const getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: 'Pizza not found'
      });
    }

    res.json({
      success: true,
      data: pizza
    });

  } catch (error) {
    console.error('Get pizza by ID error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Pizza not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get featured pizzas
// @route   GET /api/pizzas/featured
// @access  Public
const getFeaturedPizzas = async (req, res) => {
  try {
    const featuredPizzas = await Pizza.find({ 
      isFeatured: true, 
      isAvailable: true 
    })
    .sort({ 'rating.average': -1 })
    .limit(8);

    res.json({
      success: true,
      data: featuredPizzas
    });

  } catch (error) {
    console.error('Get featured pizzas error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get pizzas by category
// @route   GET /api/pizzas/category/:category
// @access  Public
const getPizzasByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const validCategories = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Specialty'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const pizzas = await Pizza.find({ 
      category, 
      isAvailable: true 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

    const totalPizzas = await Pizza.countDocuments({ 
      category, 
      isAvailable: true 
    });
    const totalPages = Math.ceil(totalPizzas / Number(limit));

    res.json({
      success: true,
      data: pizzas,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalPizzas,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1
      }
    });

  } catch (error) {
    console.error('Get pizzas by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get pizza categories with counts
// @route   GET /api/pizzas/categories/stats
// @access  Public
const getCategoryStats = async (req, res) => {
  try {
    const stats = await Pizza.aggregate([
      { $match: { isAvailable: true } },
      { 
        $group: { 
          _id: '$category', 
          count: { $sum: 1 },
          avgRating: { $avg: '$rating.average' }
        } 
      },
      { 
        $project: {
          category: '$_id',
          count: 1,
          avgRating: { $round: ['$avgRating', 1] },
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Search pizzas
// @route   GET /api/pizzas/search
// @access  Public
const searchPizzas = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const filter = {
      isAvailable: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { ingredients: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    };

    if (category) filter.category = category;
    
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);
      filter['sizes.price'] = priceFilter;
    }

    const pizzas = await Pizza.find(filter)
      .sort({ 'rating.average': -1 })
      .limit(20);

    res.json({
      success: true,
      data: pizzas,
      count: pizzas.length
    });

  } catch (error) {
    console.error('Search pizzas error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getAllPizzas,
  getPizzaById,
  getFeaturedPizzas,
  getPizzasByCategory,
  getCategoryStats,
  searchPizzas
};