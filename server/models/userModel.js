const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() {
      return !this.isTemporary;
    },
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        // Only validate email format if email is provided
        if (!email) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid email address'
    }
  },
  phone: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
    trim: true,
    validate: {
      validator: function(phone) {
        // Only validate phone format if phone is provided
        if (!phone) return true;
        return /^[\+]?[1-9][\d]{0,15}$/.test(phone);
      },
      message: 'Please provide a valid phone number'
    }
  },
  password: {
    type: String,
    required: function() {
      return !this.isTemporary;
    },
    minlength: 6
  },
  
  // OTP related fields
  resetOtp: {
    type: String,
    default: undefined
  },
  otpExpiry: {
    type: Date,
    default: undefined
  },
  
  // Password reset fields
  passwordResetToken: {
    type: String,
    default: undefined
  },
  passwordResetExpires: {
    type: Date,
    default: undefined
  },
  
  // Temporary user flag (for OTP verification before registration)
  isTemporary: {
    type: Boolean,
    default: false
  },
  
  // User status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // User role (for future pizza app features)
  role: {
    type: String,
    enum: ['customer', 'admin', 'delivery'],
    default: 'customer'
  },
  
  // Address fields for pizza delivery
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  
  // Pizza preferences
  preferences: {
    favoriteSize: {
      type: String,
      enum: ['small', 'medium', 'large', 'extra-large']
    },
    favoriteCrust: {
      type: String,
      enum: ['thin', 'thick', 'stuffed', 'gluten-free']
    },
    allergens: [String],
    dietaryRestrictions: [String]
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ resetOtp: 1 });
userSchema.index({ passwordResetToken: 1 });

// Ensure at least email or phone is provided
userSchema.pre('save', function(next) {
  if (!this.email && !this.phone) {
    next(new Error('Either email or phone number is required'));
  } else {
    next();
  }
});

// Remove expired OTPs automatically
userSchema.pre('save', function(next) {
  if (this.otpExpiry && new Date() > this.otpExpiry) {
    this.resetOtp = undefined;
    this.otpExpiry = undefined;
  }
  if (this.passwordResetExpires && new Date() > this.passwordResetExpires) {
    this.passwordResetToken = undefined;
    this.passwordResetExpires = undefined;
  }
  next();
});

// Hide sensitive information when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetOtp;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

module.exports = mongoose.model('User', userSchema);