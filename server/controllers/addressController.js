// controllers/addressController.js
const Address = require('../models/Address');

// @desc    Get user's addresses
// @route   GET /api/addresses
// @access  Private
const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const addresses = await Address.find({ user: userId })
      .sort({ isDefault: -1, createdAt: -1 });
    
    res.json({
      success: true,
      data: addresses
    });
    
  } catch (error) {
    console.error('Get user addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single address by ID
// @route   GET /api/addresses/:addressId
// @access  Private
const getAddressById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    
    const address = await Address.findOne({
      _id: addressId,
      user: userId
    });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    res.json({
      success: true,
      data: address
    });
    
  } catch (error) {
    console.error('Get address by ID error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      phone,
      address,
      city,
      district,
      province,
      postalCode,
      addressType = 'Home',
      deliveryInstructions,
      isDefault = false
    } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !phone || !address || !city || !district || !province) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }
    
    // If this is the user's first address, make it default
    const existingAddressCount = await Address.countDocuments({ user: userId });
    const shouldBeDefault = existingAddressCount === 0 || isDefault;
    
    const newAddress = new Address({
      user: userId,
      firstName,
      lastName,
      phone,
      address,
      city,
      district,
      province,
      postalCode,
      addressType,
      deliveryInstructions,
      isDefault: shouldBeDefault
    });
    
    await newAddress.save();
    
    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: newAddress
    });
    
  } catch (error) {
    console.error('Create address error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:addressId
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const updateData = req.body;
    
    const address = await Address.findOne({
      _id: addressId,
      user: userId
    });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Update address fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        address[key] = updateData[key];
      }
    });
    
    await address.save();
    
    res.json({
      success: true,
      message: 'Address updated successfully',
      data: address
    });
    
  } catch (error) {
    console.error('Update address error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:addressId
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    
    const address = await Address.findOne({
      _id: addressId,
      user: userId
    });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // If deleting default address, make another address default
    if (address.isDefault) {
      const otherAddress = await Address.findOne({
        user: userId,
        _id: { $ne: addressId }
      });
      
      if (otherAddress) {
        otherAddress.isDefault = true;
        await otherAddress.save();
      }
    }
    
    await Address.findByIdAndDelete(addressId);
    
    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Set address as default
// @route   PUT /api/addresses/:addressId/default
// @access  Private
const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    
    const address = await Address.findOne({
      _id: addressId,
      user: userId
    });
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // Set this address as default (middleware will handle unsetting others)
    address.isDefault = true;
    await address.save();
    
    res.json({
      success: true,
      message: 'Default address updated successfully',
      data: address
    });
    
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get Sri Lankan districts by province
// @route   GET /api/addresses/districts/:province
// @access  Public
const getDistrictsByProvince = async (req, res) => {
  try {
    const { province } = req.params;
    
    const districts = {
      'Western': ['Colombo', 'Gampaha', 'Kalutara'],
      'Central': ['Kandy', 'Matale', 'Nuwara Eliya'],
      'Southern': ['Galle', 'Matara', 'Hambantota'],
      'Northern': ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'],
      'Eastern': ['Batticaloa', 'Ampara', 'Trincomalee'],
      'North Western': ['Kurunegala', 'Puttalam'],
      'North Central': ['Anuradhapura', 'Polonnaruwa'],
      'Uva': ['Badulla', 'Moneragala'],
      'Sabaragamuwa': ['Ratnapura', 'Kegalle']
    };
    
    const provinceDistricts = districts[province];
    
    if (!provinceDistricts) {
      return res.status(404).json({
        success: false,
        message: 'Province not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        province,
        districts: provinceDistricts
      }
    });
    
  } catch (error) {
    console.error('Get districts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDistrictsByProvince
};