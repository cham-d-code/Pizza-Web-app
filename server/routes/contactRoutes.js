const express = require('express');
const router = express.Router();
const {
  submitContact,
  getUserContacts,
  getAllContacts,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// User routes
router.post('/submit', submitContact);
router.get('/my-submissions', getUserContacts);
router.delete('/:id', deleteContact);

// Admin routes
router.get('/admin/all', getAllContacts);
router.put('/admin/:id', updateContactStatus);

module.exports = router;