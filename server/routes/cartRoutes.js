// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyDiscount,
  removeDiscount
} = require('../controllers/cartController');

// Middleware to protect routes (you'll need to create this)
// const { protect } = require('../middleware/auth');

// For now, we'll use a simple middleware that simulates a logged-in user
const mockAuth = (req, res, next) => {
  // In a real app, you'd verify JWT token here
  // For testing, we'll use a mock user ID
  req.user = { id: '507f1f77bcf86cd799439011' }; // Mock user ID
  next();
};

// Apply auth middleware to all routes
router.use(mockAuth);

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', getCart);

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', addToCart);

// @route   PUT /api/cart/update/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/update/:itemId', updateCartItem);

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', removeFromCart);

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', clearCart);

// @route   POST /api/cart/discount
// @desc    Apply discount code
// @access  Private
router.post('/discount', applyDiscount);

// @route   DELETE /api/cart/discount
// @desc    Remove discount
// @access  Private
router.delete('/discount', removeDiscount);

module.exports = router;