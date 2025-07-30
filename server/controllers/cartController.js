// controllers/cartController.js
const Cart = require('../models/Cart');
const Pizza = require('../models/Pizza');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    
    let cart = await Cart.findOne({ 
      user: userId, 
      isActive: true 
    }).populate('items.pizza', 'name description image sizes');
    
    if (!cart) {
      // Create empty cart if none exists
      cart = new Cart({
        user: userId,
        items: [],
        subtotal: 0,
        total: 0,
        itemCount: 0
      });
      await cart.save();
    }
    
    res.json({
      success: true,
      data: cart
    });
    
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      pizzaId, 
      size, 
      quantity = 1, 
      customizations = {} 
    } = req.body;
    
    // Validate input
    if (!pizzaId || !size) {
      return res.status(400).json({
        success: false,
        message: 'Pizza ID and size are required'
      });
    }
    
    // Check if pizza exists
    const pizza = await Pizza.findById(pizzaId);
    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: 'Pizza not found'
      });
    }
    
    // Check if pizza is available
    if (!pizza.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Pizza is currently unavailable'
      });
    }
    
    // Find the price for the selected size
    const sizeInfo = pizza.sizes.find(s => s.size === size);
    if (!sizeInfo) {
      return res.status(400).json({
        success: false,
        message: 'Invalid size selected'
      });
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ 
      user: userId, 
      isActive: true 
    });
    
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: []
      });
    }
    
    // Check if same item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.pizza.toString() === pizzaId && 
      item.size === size &&
      JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );
    
    if (existingItemIndex > -1) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += parseInt(quantity);
      
      // Check max quantity limit
      if (cart.items[existingItemIndex].quantity > 10) {
        cart.items[existingItemIndex].quantity = 10;
      }
    } else {
      // Add new item to cart
      const newItem = {
        pizza: pizzaId,
        name: pizza.name,
        image: pizza.image,
        description: pizza.description,
        size: size,
        price: sizeInfo.price,
        quantity: parseInt(quantity),
        customizations: customizations,
        totalPrice: sizeInfo.price * parseInt(quantity)
      };
      
      cart.items.push(newItem);
    }
    
    await cart.save();
    
    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart
    });
    
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1 || quantity > 10) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be between 1 and 10'
      });
    }
    
    const cart = await Cart.findOne({ 
      user: userId, 
      isActive: true 
    });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    cart.items[itemIndex].quantity = parseInt(quantity);
    await cart.save();
    
    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: cart
    });
    
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    
    const cart = await Cart.findOne({ 
      user: userId, 
      isActive: true 
    });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    
    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart
    });
    
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cart = await Cart.findOne({ 
      user: userId, 
      isActive: true 
    });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = [];
    await cart.save();
    
    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
    
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Apply discount code
// @route   POST /api/cart/discount
// @access  Private
const applyDiscount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Discount code is required'
      });
    }
    
    const cart = await Cart.findOne({ 
      user: userId, 
      isActive: true 
    });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    // Simple discount codes (you can expand this with a Discount model)
    const discountCodes = {
      'WELCOME10': { percentage: 10, minOrder: 1000 },
      'SAVE20': { percentage: 20, minOrder: 2000 },
      'FIRSTORDER': { amount: 300, minOrder: 1500 },
      'PIZZA50': { amount: 500, minOrder: 2500 }
    };
    
    const discount = discountCodes[code.toUpperCase()];
    
    if (!discount) {
      return res.status(400).json({
        success: false,
        message: 'Invalid discount code'
      });
    }
    
    if (cart.subtotal < discount.minOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of LKR ${discount.minOrder} required for this discount`
      });
    }
    
    // Apply discount
    if (discount.percentage) {
      cart.discount.amount = Math.round(cart.subtotal * (discount.percentage / 100));
      cart.discount.percentage = discount.percentage;
    } else {
      cart.discount.amount = discount.amount;
      cart.discount.percentage = 0;
    }
    
    cart.discount.code = code.toUpperCase();
    await cart.save();
    
    res.json({
      success: true,
      message: 'Discount applied successfully',
      data: cart
    });
    
  } catch (error) {
    console.error('Apply discount error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Remove discount
// @route   DELETE /api/cart/discount
// @access  Private
const removeDiscount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cart = await Cart.findOne({ 
      user: userId, 
      isActive: true 
    });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.discount = {
      amount: 0,
      code: null,
      percentage: 0
    };
    
    await cart.save();
    
    res.json({
      success: true,
      message: 'Discount removed successfully',
      data: cart
    });
    
  } catch (error) {
    console.error('Remove discount error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyDiscount,
  removeDiscount
};