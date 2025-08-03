const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');
const User = require('../models/userModel');

// @desc    Submit a new contact form
// @route   POST /api/contact/submit
// @access  Private (authenticated users only)
const submitContact = asyncHandler(async (req, res) => {
  const { subject, message, contactEmail, contactPhone } = req.body;

  // Validation
  if (!subject || !message || !contactEmail) {
    res.status(400);
    throw new Error('Subject, message, and contact email are required');
  }

  if (subject.length > 100) {
    res.status(400);
    throw new Error('Subject cannot exceed 100 characters');
  }

  if (message.length > 1000) {
    res.status(400);
    throw new Error('Message cannot exceed 1000 characters');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactEmail)) {
    res.status(400);
    throw new Error('Please provide a valid email address');
  }

  // Phone validation (optional)
  if (contactPhone) {
    const phoneRegex = /^(0\d{9}|\+94\d{9})$/;
    if (!phoneRegex.test(contactPhone)) {
      res.status(400);
      throw new Error('Please provide a valid Sri Lankan phone number');
    }
  }

  try {
    const contact = await Contact.create({
      user: req.user._id,
      subject: subject.trim(),
      message: message.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      contactPhone: contactPhone ? contactPhone.trim() : undefined
    });

    // Populate user information for response
    await contact.populate('user', 'name email phone');

    res.status(201).json({
      message: 'Contact form submitted successfully',
      contact: {
        id: contact._id,
        subject: contact.subject,
        message: contact.message,
        contactEmail: contact.contactEmail,
        contactPhone: contact.contactPhone,
        status: contact.status,
        createdAt: contact.createdAt,
        user: {
          name: contact.user.name,
          email: contact.user.email
        }
      }
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500);
    throw new Error('Failed to submit contact form');
  }
});

// @desc    Get user's contact submissions
// @route   GET /api/contact/my-submissions
// @access  Private
const getUserContacts = asyncHandler(async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      message: 'Contact submissions retrieved successfully',
      count: contacts.length,
      contacts
    });
  } catch (error) {
    console.error('Error fetching user contacts:', error);
    res.status(500);
    throw new Error('Failed to fetch contact submissions');
  }
});

// @desc    Get all contact submissions (Admin only)
// @route   GET /api/contact/admin/all
// @access  Private (Admin)
const getAllContacts = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied. Admin privileges required.');
  }

  const { status, priority, page = 1, limit = 10 } = req.query;
  
  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  try {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const contacts = await Contact.find(filter)
      .populate('user', 'name email phone')
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      message: 'All contact submissions retrieved successfully',
      count: contacts.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      contacts
    });
  } catch (error) {
    console.error('Error fetching all contacts:', error);
    res.status(500);
    throw new Error('Failed to fetch contact submissions');
  }
});

// @desc    Update contact status and add admin response
// @route   PUT /api/contact/admin/:id
// @access  Private (Admin)
const updateContactStatus = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied. Admin privileges required.');
  }

  const { status, priority, adminResponse } = req.body;
  const contactId = req.params.id;

  try {
    const contact = await Contact.findById(contactId);

    if (!contact) {
      res.status(404);
      throw new Error('Contact submission not found');
    }

    // Update fields if provided
    if (status) contact.status = status;
    if (priority) contact.priority = priority;
    if (adminResponse) {
      contact.adminResponse = adminResponse.trim();
      contact.respondedBy = req.user._id;
      contact.respondedAt = new Date();
    }
    
    contact.isRead = true;

    await contact.save();

    // Populate for response
    await contact.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'respondedBy', select: 'name email' }
    ]);

    res.status(200).json({
      message: 'Contact submission updated successfully',
      contact
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500);
    throw new Error('Failed to update contact submission');
  }
});

// @desc    Delete contact submission
// @route   DELETE /api/contact/:id
// @access  Private (User can delete own, Admin can delete any)
const deleteContact = asyncHandler(async (req, res) => {
  const contactId = req.params.id;

  try {
    const contact = await Contact.findById(contactId);

    if (!contact) {
      res.status(404);
      throw new Error('Contact submission not found');
    }

    // Check if user owns the contact or is admin
    if (contact.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Access denied. You can only delete your own submissions.');
    }

    await Contact.findByIdAndDelete(contactId);

    res.status(200).json({
      message: 'Contact submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500);
    throw new Error('Failed to delete contact submission');
  }
});

module.exports = {
  submitContact,
  getUserContacts,
  getAllContacts,
  updateContactStatus,
  deleteContact
};