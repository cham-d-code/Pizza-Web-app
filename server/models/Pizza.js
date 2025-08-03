// models/Pizza.js
const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pizza name is required'],
    trim: true,
    maxlength: [50, 'Pizza name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Pizza description is required'],
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  image: {
    type: String,
    required: [true, 'Pizza image is required'],
    validate: {
      validator: function(v) {
        // Allow localhost URLs and relative paths for local development
        return /^(https?:\/\/.+\.(jpg|jpeg|png|webp|gif)|\/.*\.(jpg|jpeg|png|webp|gif))$/i.test(v);
      },
      message: 'Please provide a valid image URL or path'
    }
  },
  category: {
    type: String,
    required: [true, 'Pizza category is required'],
    enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Specialty'],
    default: 'Vegetarian'
  },
  sizes: [{
    size: {
      type: String,
      required: true,
      enum: ['Small', 'Medium', 'Large', 'Extra Large']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    diameter: {
      type: String,
      required: true // e.g., "10 inch", "12 inch"
    }
  }],
  ingredients: [{
    type: String,
    trim: true
  }],
  nutritionInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
    fiber: { type: Number, min: 0 }
  },
  allergens: [{
    type: String,
    enum: ['Gluten', 'Dairy', 'Nuts', 'Soy', 'Eggs', 'Sesame']
  }],
  isVegetarian: {
    type: Boolean,
    default: true
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  spiceLevel: {
    type: String,
    enum: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
    default: 'Mild'
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  preparationTime: {
    type: Number, // in minutes
    default: 15,
    min: [5, 'Preparation time cannot be less than 5 minutes']
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for better query performance
pizzaSchema.index({ name: 1 });
pizzaSchema.index({ category: 1 });
pizzaSchema.index({ isAvailable: 1 });
pizzaSchema.index({ 'rating.average': -1 });

// Virtual for price range
pizzaSchema.virtual('priceRange').get(function() {
  if (this.sizes && this.sizes.length > 0) {
    const prices = this.sizes.map(size => size.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return minPrice === maxPrice ? `LKR ${minPrice}` : `LKR ${minPrice} - ${maxPrice}`;
  }
  return 'Price not available';
});

// Ensure virtual fields are serialized
pizzaSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Pizza', pizzaSchema);