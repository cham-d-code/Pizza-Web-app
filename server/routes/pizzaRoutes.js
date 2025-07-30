// routes/pizzaRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllPizzas,
  getPizzaById,
  getFeaturedPizzas,
  getPizzasByCategory,
  getCategoryStats,
  searchPizzas
} = require('../controllers/pizzaController');

// IMPORTANT: Order matters! Specific routes MUST come before parameter routes

// @route   GET /api/pizzas
// @desc    Get all pizzas with optional filters
// @access  Public
router.get('/', getAllPizzas);

// @route   GET /api/pizzas/featured
// @desc    Get featured pizzas
// @access  Public
router.get('/featured', getFeaturedPizzas);

// @route   GET /api/pizzas/categories/stats
// @desc    Get category statistics
// @access  Public
router.get('/categories/stats', getCategoryStats);

// @route   GET /api/pizzas/search
// @desc    Search pizzas
// @access  Public
router.get('/search', searchPizzas);

// @route   GET /api/pizzas/category/:category
// @desc    Get pizzas by category
// @access  Public
router.get('/category/:category', getPizzasByCategory);

// MUST BE LAST - catches any remaining paths as IDs
// @route   GET /api/pizzas/:id
// @desc    Get single pizza by ID
// @access  Public
router.get('/:id', getPizzaById);

module.exports = router;