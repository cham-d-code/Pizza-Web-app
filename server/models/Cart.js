// models/Cart.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  pizza: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza',
    required: [true, 'Pizza is required']
  },
  name: {
    type: String,
    required: [true, 'Pizza name is required']
  },
  image: {
    type: String,
    required: [true, 'Pizza image is required']
  },
  description: {
    type: String,
    required: [true, 'Pizza description is required']
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    enum: ['Small', 'Medium', 'Large', 'Extra Large']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    max: [10, 'Maximum 10 items per pizza']
  },
  totalPrice: {
    type: Number,
    required: true
  },
  customizations: {
    extraCheese: { type: Boolean, default: false },
    extraToppings: [{
      name: String,
      price: Number
    }],
    removeToppings: [String],
    specialInstructions: String
  }
}, {
  timestamps: true
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    default: 0,
    min: [0, 'Subtotal cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: [0, 'Delivery fee cannot be negative']
  },
  discount: {
    amount: {
      type: Number,
      default: 0
    },
    code: {
      type: String,
      default: null
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  total: {
    type: Number,
    default: 0,
    min: [0, 'Total cannot be negative']
  },
  itemCount: {
    type: Number,
    default: 0,
    min: [0, 'Item count cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    expires: 0
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  // Calculate subtotal and item count
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate tax (10% tax rate)
  this.tax = Math.round(this.subtotal * 0.10);
  
  // Set delivery fee (free delivery for orders above LKR 3000)
  this.deliveryFee = this.subtotal >= 3000 ? 0 : 200;
  
  // Calculate total
  this.total = this.subtotal + this.tax + this.deliveryFee - this.discount.amount;
  
  next();
});

// Update item total price before saving
cartItemSchema.pre('save', function(next) {
  this.totalPrice = this.price * this.quantity;
  
  // Add customization costs
  if (this.customizations.extraCheese) {
    this.totalPrice += 150 * this.quantity; // LKR 150 per pizza for extra cheese
  }
  
  if (this.customizations.extraToppings && this.customizations.extraToppings.length > 0) {
    const toppingsPrice = this.customizations.extraToppings.reduce((sum, topping) => sum + topping.price, 0);
    this.totalPrice += toppingsPrice * this.quantity;
  }
  
  next();
});

// Index for better performance
cartSchema.index({ user: 1, isActive: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for formatted total
cartSchema.virtual('formattedTotal').get(function() {
  return `LKR ${this.total.toFixed(2)}`;
});

// Virtual for formatted subtotal
cartSchema.virtual('formattedSubtotal').get(function() {
  return `LKR ${this.subtotal.toFixed(2)}`;
});

// Ensure virtual fields are serialized
cartSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);