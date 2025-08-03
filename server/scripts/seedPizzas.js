const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pizza = require('../models/Pizza');
const db = require('../config/db');

dotenv.config();

const pizzas = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439001'),
    name: "Sausage Delight",
    image: "http://localhost:3000/sausage Delight.jpg",
    sizes: [
      { size: "Small", diameter: "10 inch", price: 2500 },
      { size: "Medium", diameter: "12 inch", price: 2900 },
      { size: "Large", diameter: "14 inch", price: 3500 }
    ],
    description: "Made with spicy veggie masala, onions, tomato & cheese",
    category: "Non-Vegetarian",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: "Medium",
    rating: { average: 4.5, count: 120 },
    isAvailable: true,
    isFeatured: true,
    ingredients: ["Spicy veggie masala", "Onions", "Tomato", "Cheese", "Sausage"],
    tags: ["spicy", "sausage", "popular"]
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439002'),
    name: "Margherita",
    image: "http://localhost:3000/Margherita.jpg",
    sizes: [
      { size: "Small", diameter: "10 inch", price: 2100 },
      { size: "Medium", diameter: "12 inch", price: 2500 },
      { size: "Large", diameter: "14 inch", price: 3100 }
    ],
    description: "Rich tomato sauce base topped with cream cheese, tomato",
    category: "Vegetarian",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: "Mild",
    rating: { average: 4.7, count: 200 },
    isAvailable: true,
    isFeatured: true,
    ingredients: ["Tomato sauce", "Cream cheese", "Tomato", "Mozzarella"],
    tags: ["classic", "vegetarian", "cheese"]
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439003'),
    name: "Chilli Chicken Pizza",
    image: "http://localhost:3000/Chilli Chicken Pizza.jpg",
    sizes: [
      { size: "Small", diameter: "10 inch", price: 2500 },
      { size: "Medium", diameter: "12 inch", price: 2900 },
      { size: "Large", diameter: "14 inch", price: 3500 }
    ],
    description: "Made with spicy veggie masala, onions, tomato & cheese",
    category: "Non-Vegetarian",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: "Hot",
    rating: { average: 4.6, count: 150 },
    isAvailable: true,
    isFeatured: true,
    ingredients: ["Chicken", "Spicy veggie masala", "Onions", "Tomato", "Cheese"],
    tags: ["spicy", "chicken", "hot"]
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439004'),
    name: "Veggie Masala Pizza",
    image: "http://localhost:3000/Veggie Masala.jpg",
    sizes: [
      { size: "Small", diameter: "10 inch", price: 2600 },
      { size: "Medium", diameter: "12 inch", price: 2980 },
      { size: "Large", diameter: "14 inch", price: 3600 }
    ],
    description: "Made with spicy veggie masala, onions, tomato & cheese",
    category: "Vegetarian",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: "Medium",
    rating: { average: 4.4, count: 90 },
    isAvailable: true,
    isFeatured: true,
    ingredients: ["Spicy veggie masala", "Onions", "Tomato", "Cheese", "Bell peppers"],
    tags: ["vegetarian", "spicy", "veggie"]
  },
  {
    name: "Pepperoni",
    image: "http://localhost:3000/Pepperoni.jpg",
    sizes: [
      { size: "Small", diameter: "10 inch", price: 2400 },
      { size: "Medium", diameter: "12 inch", price: 2800 },
      { size: "Large", diameter: "14 inch", price: 3400 }
    ],
    description: "Pepperoni, mozzarella, and tomato sauce.",
    category: "Non-Vegetarian",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: "Medium",
    rating: { average: 4.8, count: 200 },
    isAvailable: true,
    isFeatured: false,
    ingredients: ["Pepperoni", "Mozzarella", "Tomato sauce"],
    tags: ["pepperoni", "classic", "meat"]
  },
  {
    name: "Veggie Supreme",
    image: "http://localhost:3000/Veggie Supreme.jpg",
    sizes: [
      { size: "Small", diameter: "10 inch", price: 2300 },
      { size: "Medium", diameter: "12 inch", price: 2700 },
      { size: "Large", diameter: "14 inch", price: 3300 }
    ],
    description: "Loaded with fresh veggies and mozzarella.",
    category: "Vegetarian",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: "Mild",
    rating: { average: 4.6, count: 90 },
    isAvailable: true,
    isFeatured: false,
    ingredients: ["Fresh vegetables", "Mozzarella", "Tomato sauce", "Bell peppers", "Mushrooms"],
    tags: ["vegetarian", "veggie", "fresh"]
  },
  {
    name: "Chicken BBQ",
    image: "http://localhost:3000/Chicken BBQ.jpg",
    sizes: [
      { size: "Small", diameter: "10 inch", price: 2500 },
      { size: "Medium", diameter: "12 inch", price: 2900 },
      { size: "Large", diameter: "14 inch", price: 3500 }
    ],
    description: "BBQ chicken, onions, and mozzarella.",
    category: "Non-Vegetarian",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: "Medium",
    rating: { average: 4.5, count: 110 },
    isAvailable: true,
    isFeatured: false,
    ingredients: ["BBQ chicken", "Onions", "Mozzarella", "BBQ sauce"],
    tags: ["bbq", "chicken", "sweet"]
  },
  {
    name: "Vegan Delight",
    image: "http://localhost:3000/Vegan Delight.jpg",
    sizes: [
      { size: "Small", diameter: "10 inch", price: 2350 },
      { size: "Medium", diameter: "12 inch", price: 2750 },
      { size: "Large", diameter: "14 inch", price: 3350 }
    ],
    description: "Vegan cheese, veggies, and tomato sauce.",
    category: "Vegan",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    spiceLevel: "Mild",
    rating: { average: 4.4, count: 80 },
    isAvailable: true,
    isFeatured: false,
    ingredients: ["Vegan cheese", "Vegetables", "Tomato sauce"],
    tags: ["vegan", "plant-based", "healthy"]
  }
];

async function seedPizzas() {
  try {
    await db();
    console.log('🔗 Connected to MongoDB');
    await Pizza.deleteMany({});
    console.log('🗑️  Cleared existing pizzas');
    await Pizza.insertMany(pizzas);
    console.log('🍕 Seeded pizzas successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seedPizzas();