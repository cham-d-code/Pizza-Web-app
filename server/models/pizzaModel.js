const mongoose = require('mongoose');

// Define the pizza schema to structure the pizza data in MongoDB
const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // Pizza name is required
  },
  price: {
    type: Number,
    required: true,  // Price is required
  },
  image: {
    type: String,
    required: true,  // Image URL is required
  },
  description: {
    type: String,
    required: true,  // Description is required
  },
});

// Export the model so it can be used in other files
module.exports = mongoose.model('Pizza', pizzaSchema);
