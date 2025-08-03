// controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/Address');
const Pizza = require('../models/Pizza');

// @desc    Create new Cash on Delivery order from cart
// @route   POST /api/orders/create-cod
// @access  Private
const createCashOnDeliveryOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      shippingAddressId,
      deliveryType = 'Delivery',
      customerNotes,
      // If no saved address, accept new address data
      newAddress
    } = req.body;

    // Force payment method to Cash on Delivery
    const paymentMethod = 'Cash on Delivery';

    // Cash on Delivery is only available for delivery, not pickup
    if (deliveryType === 'Pickup') {
      return res.status(400).json({
        success: false,
        message: 'Cash on Delivery is only available for delivery orders'
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ 
      user: userId, 
      isActive: true 
    }).populate('items.pizza');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Minimum order amount for Cash on Delivery (optional validation)
    const minimumCODAmount = 10; // Set your minimum amount
    if (cart.total < minimumCODAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount for Cash on Delivery is $${minimumCODAmount}`
      });
    }

    // Get shipping address
    let shippingAddress;
    
    if (shippingAddressId) {
      // Use existing saved address
      const address = await Address.findOne({
        _id: shippingAddressId,
        user: userId
      });
      
      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Shipping address not found'
        });
      }
      
      shippingAddress = {
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        address: address.address,
        city: address.city,
        district: address.district,
        province: address.province,
        postalCode: address.postalCode,
        deliveryInstructions: address.deliveryInstructions
      };
    } else if (newAddress) {
      // Use new address provided in request
      const { firstName, lastName, phone, address, city, district, province, postalCode, deliveryInstructions } = newAddress;
      
      // Validate required fields
      if (!firstName || !lastName || !phone || !address || !city || !district || !province) {
        return res.status(400).json({
          success: false,
          message: 'All address fields are required'
        });
      }
      
      // Phone number is crucial for COD orders
      if (!phone || phone.length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Valid phone number is required for Cash on Delivery orders'
        });
      }
      
      shippingAddress = {
        firstName,
        lastName,
        phone,
        address,
        city,
        district,
        province,
        postalCode,
        deliveryInstructions
      };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    // Verify all pizzas are still available
    for (const item of cart.items) {
      const pizza = await Pizza.findById(item.pizza);
      if (!pizza || !pizza.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${item.name} is no longer available`
        });
      }
    }

    // Create Cash on Delivery order
    const order = new Order({
      user: userId,
      items: cart.items.map(item => ({
        pizza: item.pizza,
        name: item.name,
        image: item.image,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        customizations: item.customizations
      })),
      subtotal: cart.subtotal,
      tax: cart.tax,
      deliveryFee: cart.deliveryFee,
      discount: cart.discount,
      total: cart.total,
      shippingAddress,
      paymentMethod,
      deliveryType,
      status: 'Delivered', // Auto-mark as delivered for immediate review access
      actualDeliveryTime: new Date(), // Set actual delivery time to now
      paymentStatus: 'Pending', // COD orders start as pending
      notes: {
        customerNotes: customerNotes || '',
        codInstructions: 'Please have exact change ready. Payment to be collected upon delivery.'
      },
      // COD specific fields
      codDetails: {
        amountToBePaid: cart.total,
        exactChangeRequested: true,
        specialInstructions: customerNotes || ''
      }
    });

    await order.save();

    // Clear the cart after successful order creation
    cart.items = [];
    cart.isActive = false;
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Cash on Delivery order created successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: order.paymentMethod,
        amountToBePaid: order.total,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        instructions: 'Please have exact change ready. Payment will be collected upon delivery.'
      }
    });

  } catch (error) {
    console.error('Create COD order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update COD payment status (for delivery personnel)
// @route   PUT /api/orders/:orderId/cod-payment
// @access  Private (Admin/DeliveryPerson)
const updateCODPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { 
      paymentStatus,
      amountReceived,
      changeGiven,
      receivedBy,
      notes
    } = req.body;

    const validStatuses = ['Completed', 'Failed'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status for COD'
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      paymentMethod: 'Cash on Delivery'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'COD order not found'
      });
    }

    // Update payment details for COD
    order.paymentStatus = paymentStatus;
    order.paymentDetails = {
      paidAt: paymentStatus === 'Completed' ? new Date() : null,
      paymentMethod: 'Cash on Delivery'
    };

    // Update COD specific details
    order.codDetails = {
      ...order.codDetails,
      amountReceived: amountReceived || order.total,
      changeGiven: changeGiven || 0,
      receivedBy: receivedBy || '',
      paymentCollectedAt: paymentStatus === 'Completed' ? new Date() : null,
      notes: notes || ''
    };

    // Update order status based on payment status
    if (paymentStatus === 'Completed') {
      order.status = 'Delivered';
    } else if (paymentStatus === 'Failed') {
      order.status = 'Payment Failed';
    }

    await order.save();

    res.json({
      success: true,
      message: 'COD payment status updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Update COD payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all COD orders (for admin/delivery management)
// @route   GET /api/orders/cod-orders
// @access  Private (Admin)
const getCODOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus } = req.query;

    const filter = { paymentMethod: 'Cash on Delivery' };
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'firstName lastName email phone')
      .populate('items.pizza', 'name');

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / Number(limit));

    // Calculate COD statistics
    const totalCODAmount = await Order.aggregate([
      { $match: { paymentMethod: 'Cash on Delivery', paymentStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const pendingCODAmount = await Order.aggregate([
      { $match: { paymentMethod: 'Cash on Delivery', paymentStatus: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalOrders,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1
      },
      statistics: {
        totalCODCollected: totalCODAmount[0]?.total || 0,
        pendingCODAmount: pendingCODAmount[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Get COD orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get user's orders (modified to show COD status)
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const filter = { user: userId };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('items.pizza', 'name');

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / Number(limit));

    // Add COD specific information to orders
    const ordersWithCODInfo = orders.map(order => {
      const orderObj = order.toObject();
      if (order.paymentMethod === 'Cash on Delivery') {
        orderObj.paymentInstructions = 'Please have exact change ready. Payment will be collected upon delivery.';
        orderObj.amountToBePaid = order.total;
      }
      return orderObj;
    });

    res.json({
      success: true,
      data: ordersWithCODInfo,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalOrders,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1
      }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single order by ID (modified for COD)
// @route   GET /api/orders/:orderId
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: userId
    }).populate('items.pizza', 'name description image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const orderObj = order.toObject();
    
    // Add COD specific information
    if (order.paymentMethod === 'Cash on Delivery') {
      orderObj.paymentInstructions = 'Please have exact change ready. Payment will be collected upon delivery.';
      orderObj.amountToBePaid = order.total;
      
      if (order.paymentStatus === 'Pending') {
        orderObj.statusMessage = 'Your order is being prepared. Payment will be collected upon delivery.';
      } else if (order.paymentStatus === 'Completed') {
        orderObj.statusMessage = 'Order delivered and payment collected successfully.';
      }
    }

    res.json({
      success: true,
      data: orderObj
    });

  } catch (error) {
    console.error('Get order by ID error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Original functions remain the same
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      shippingAddressId,
      paymentMethod,
      deliveryType = 'Delivery',
      customerNotes,
      newAddress
    } = req.body;

    // Validate payment method
    const validPaymentMethods = ['Card', 'Cash on Delivery', 'Digital Wallet'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
      });
    }

    // If Cash on Delivery is selected, redirect to COD-specific function
    if (paymentMethod === 'Cash on Delivery') {
      req.body.paymentMethod = paymentMethod;
      return createCashOnDeliveryOrder(req, res);
    }

    // --- BEGIN: Card/Digital Wallet Order Logic ---
    // Get user's cart
    const cart = await Cart.findOne({ user: userId, isActive: true }).populate('items.pizza');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Get shipping address from request body
    const shippingAddress = req.body.shippingAddress || {};

    // Generate order number manually (since pre-save hook isn't running)
    const count = await Order.countDocuments();
    const orderNumber = `PZ${String(count + 1).padStart(6, '0')}`;
    const estimatedDeliveryTime = new Date(Date.now() + 45 * 60 * 1000); // 45 minutes from now

    // Create the order
    const order = new Order({
      user: userId,
      orderNumber,
      estimatedDeliveryTime,
      items: cart.items.map(item => ({
        pizza: item.pizza,
        name: item.name,
        image: item.image,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        customizations: item.customizations
      })),
      subtotal: cart.subtotal,
      tax: cart.tax,
      deliveryFee: cart.deliveryFee,
      discount: cart.discount,
      total: cart.total,
      shippingAddress,
      paymentMethod,
      deliveryType,
      status: 'Delivered', // Auto-mark as delivered for immediate review access
      actualDeliveryTime: new Date(), // Set actual delivery time to now
      paymentStatus: 'Completed', // Card/Digital Wallet: mark as paid
      notes: { customerNotes: customerNotes || '' }
    });

    await order.save();

    // Clear the cart after successful order creation
    cart.items = [];
    cart.isActive = false;
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: order.paymentMethod
      }
    });
    // --- END: Card/Digital Wallet Order Logic ---

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['Pending', 'Confirmed', 'Preparing'];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status and cancellation details
    order.status = 'Cancelled';
    order.cancellation = {
      reason: reason || 'Cancelled by customer',
      cancelledBy: 'Customer',
      cancelledAt: new Date(),
      refundAmount: order.paymentStatus === 'Completed' ? order.total : 0,
      refundStatus: order.paymentMethod === 'Cash on Delivery' ? 'Not Applicable' : 
                   (order.paymentStatus === 'Completed' ? 'Pending' : 'Not Applicable')
    };

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

const addOrderReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      status: 'Delivered'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not delivered'
      });
    }

    if (order.review.rating) {
      return res.status(400).json({
        success: false,
        message: 'Order has already been reviewed'
      });
    }

    order.review = {
      rating: Number(rating),
      comment: comment || '',
      reviewDate: new Date()
    };

    await order.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      data: order
    });

  } catch (error) {
    console.error('Add order review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  createOrder,
  createCashOnDeliveryOrder,
  getUserOrders,
  getOrderById,
  updateCODPaymentStatus,
  cancelOrder,
  addOrderReview,
  getCODOrders
};