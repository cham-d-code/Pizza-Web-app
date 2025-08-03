// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  createCashOnDeliveryOrder,
  getUserOrders,
  getOrderById,
  updateCODPaymentStatus,  // Changed from updatePaymentStatus
  cancelOrder,
  addOrderReview,
  getCODOrders
} = require('../controllers/orderController');

// Mock auth middleware (replace with real auth)
const mockAuth = (req, res, next) => {
  req.user = { id: '507f1f77bcf86cd799439011' };
  next();
};

router.use(mockAuth);

// Add POST / route for RESTful order creation
router.post('/', createOrder);

// @route   POST /api/orders/create
// @desc    Create new order from cart
// @access  Private
router.post('/create', createOrder);

// @route   POST /api/orders/create-cod
// @desc    Create new Cash on Delivery order from cart
// @access  Private
router.post('/create-cod', createCashOnDeliveryOrder);

// @route   GET /api/orders
// @desc    Get user's orders with pagination
// @access  Private
router.get('/', getUserOrders);

// @route   GET /api/orders/cod-orders
// @desc    Get all COD orders (Admin only)
// @access  Private (Admin)
router.get('/cod-orders', getCODOrders);

// @route   GET /api/orders/:orderId
// @desc    Get single order by ID
// @access  Private
router.get('/:orderId', getOrderById);

// @route   PUT /api/orders/:orderId/cod-payment
// @desc    Update COD payment status (for delivery personnel)
// @access  Private (Admin/DeliveryPerson)
router.put('/:orderId/cod-payment', updateCODPaymentStatus);

// @route   PUT /api/orders/:orderId/cancel
// @desc    Cancel order
// @access  Private
router.put('/:orderId/cancel', cancelOrder);

// @route   POST /api/orders/:orderId/review
// @desc    Add review to delivered order
// @access  Private
router.post('/:orderId/review', addOrderReview);

module.exports = router;

// routes/addressRoutes.js
const addressRouter = express.Router();
const {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDistrictsByProvince
} = require('../controllers/addressController');

// Mock auth middleware (replace with real auth)
const mockAuth2 = (req, res, next) => {
  req.user = { id: '507f1f77bcf86cd799439011' };
  next();
};

// Public route for getting districts
// @route   GET /api/addresses/districts/:province
// @desc    Get districts by province
// @access  Public
addressRouter.get('/districts/:province', getDistrictsByProvince);

// Apply auth to all other routes
addressRouter.use(mockAuth2);

// @route   GET /api/addresses
// @desc    Get user's addresses
// @access  Private
addressRouter.get('/', getUserAddresses);

// @route   POST /api/addresses
// @desc    Create new address
// @access  Private
addressRouter.post('/', createAddress);

// @route   GET /api/addresses/:addressId
// @desc    Get single address by ID
// @access  Private
addressRouter.get('/:addressId', getAddressById);

// @route   PUT /api/addresses/:addressId
// @desc    Update address
// @access  Private
addressRouter.put('/:addressId', updateAddress);

// @route   DELETE /api/addresses/:addressId
// @desc    Delete address
// @access  Private
addressRouter.delete('/:addressId', deleteAddress);

// @route   PUT /api/addresses/:addressId/default
// @desc    Set address as default
// @access  Private
addressRouter.put('/:addressId/default', setDefaultAddress);

module.exports = { orderRoutes: router, addressRoutes: addressRouter };