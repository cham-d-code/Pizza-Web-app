const express = require('express');
const router = express.Router();
const { getPizzas, addPizza } = require('../controllers/pizzaController');  // Import controller functions

// Define the route to get all pizzas
router.get('/', getPizzas);  // Calls the getPizzas function when a GET request is made to /api/pizzas

// Define the route to add a new pizza
router.post('/', addPizza);  // Calls the addPizza function when a POST request is made to /api/pizzas

// Export the router so it can be used in server.js
module.exports = router;
