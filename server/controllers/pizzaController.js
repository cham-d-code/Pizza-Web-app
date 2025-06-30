const Pizza = require('../models/pizzaModel');  // Import the pizza model

// Controller function to get all pizzas from the database
const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find();  // Get all pizzas from MongoDB
    res.json(pizzas);  // Send the pizzas as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pizzas' });  // Handle errors
  }
};

// Controller function to add a new pizza to the database
const addPizza = async (req, res) => {
  try {
    const { name, price, image, description } = req.body;  // Destructure data from the request body

    // Create a new pizza instance
    const newPizza = new Pizza({
      name,
      price,
      image,
      description,
    });

    // Save the pizza to the database
    await newPizza.save();

    res.status(201).json(newPizza);  // Send the created pizza as a response
  } catch (error) {
    res.status(500).json({ message: 'Error adding pizza' });  // Handle errors
  }
};

// Export the controller functions so they can be used in the routes
module.exports = { getPizzas, addPizza };
