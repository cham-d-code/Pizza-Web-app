// models/Order.js

console.log('Order model loaded');
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  pizza: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true,
    enum: ['Small', 'Medium', 'Large', 'Extra Large']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
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
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  
  // Pricing Details
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryFee: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    amount: {
      type: Number,
      default: 0,
      min: 0
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
    required: true,
    min: 0
  },
  
  // Shipping Address
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String },
    deliveryInstructions: { type: String }
  },
  
  // Payment Details
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Card', 'Cash on Delivery', 'Digital Wallet']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentDetails: {
    transactionId: String,
    cardLast4: String,
    cardType: String,
    paymentGateway: String,
    paidAt: Date
  },
  
  // Order Status
  status: {
    type: String,
    required: true,
    enum: [
      'Pending',           // Order placed, waiting for confirmation
      'Confirmed',         // Order confirmed by restaurant
      'Preparing',         // Kitchen is preparing the order
      'Ready for Pickup',  // Order ready for delivery pickup
      'Out for Delivery',  // Order is being delivered
      'Delivered',         // Order successfully delivered
      'Cancelled',         // Order cancelled
      'Refunded'          // Order refunded
    ],
    default: 'Pending'
  },
  
  // Delivery Details
  deliveryType: {
    type: String,
    enum: ['Delivery', 'Pickup'],
    default: 'Delivery'
  },
  estimatedDeliveryTime: {
    type: Date,
    required: true
  },
  actualDeliveryTime: {
    type: Date
  },
  deliveryAgent: {
    name: String,
    phone: String,
    vehicleNumber: String
  },
  
  // Order Tracking
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Additional Info
  notes: {
    customerNotes: String,
    adminNotes: String,
    kitchenNotes: String
  },
  
  // Review and Rating
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    reviewDate: Date
  },
  
  // Cancellation
  cancellation: {
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['Customer', 'Admin', 'System']
    },
    cancelledAt: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['Not Applicable', 'Pending', 'Processed', 'Failed']
    }
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    console.log('Generating order number...');
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `PZ${String(count + 1).padStart(6, '0')}`;
    
    // Add initial status to history with appropriate note
    const note = this.status === 'Delivered' 
      ? 'Order placed and auto-delivered for review access' 
      : 'Order placed successfully';
    
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: note
    });
    
    // Set estimated delivery time (45 minutes from now)
    this.estimatedDeliveryTime = new Date(Date.now() + 45 * 60 * 1000);
  }
  next();
});

// Update status history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: `Status updated to ${this.status}`
    });
    
    // Set actual delivery time when delivered
    if (this.status === 'Delivered' && !this.actualDeliveryTime) {
      this.actualDeliveryTime = new Date();
    }
  }
  next();
});

// Virtual for formatted total
orderSchema.virtual('formattedTotal').get(function() {
  return `LKR ${this.total.toFixed(2)}`;
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) {
    return `${diffMins} minutes ago`;
  } else if (diffMins < 1440) {
    return `${Math.floor(diffMins / 60)} hours ago`;
  } else {
    return `${Math.floor(diffMins / 1440)} days ago`;
  }
});

// Indexes for better performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);