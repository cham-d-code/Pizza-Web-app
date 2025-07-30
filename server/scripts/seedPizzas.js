const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pizza = require('../models/Pizza'); // Adjust path as needed

dotenv.config();

const pizzaData = [
  // CLASSIC FAVORITES
  {
    name: "Margherita Classic",
    description: "Traditional Italian pizza with fresh mozzarella, San Marzano tomatoes, fresh basil, and extra virgin olive oil on a hand-tossed crust.",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
    category: "Vegetarian",
    sizes: {
      Small: { price: 1200, diameter: "9 inch" },
      Medium: { price: 1800, diameter: "12 inch" },
      Large: { price: 2400, diameter: "15 inch" }
    },
    basePrice: 1800,
    ingredients: ["Fresh Mozzarella", "San Marzano Tomatoes", "Fresh Basil", "Extra Virgin Olive Oil"],
    allergens: ["Gluten", "Dairy"],
    nutrition: {
      calories: 280,
      protein: 12,
      carbs: 35,
      fat: 10,
      fiber: 2
    },
    cookTime: "12-15 min",
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.8,
    reviews: 156,
    popularity: 95,
    featured: true,
    available: true
  },

  {
    name: "Pepperoni Supreme",
    description: "America's favorite! Loaded with premium pepperoni, melted mozzarella cheese, and our signature pizza sauce on a crispy thin crust.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    category: "Non-Vegetarian",
    sizes: {
      Small: { price: 1400, diameter: "9 inch" },
      Medium: { price: 2000, diameter: "12 inch" },
      Large: { price: 2600, diameter: "15 inch" }
    },
    basePrice: 2000,
    ingredients: ["Premium Pepperoni", "Mozzarella Cheese", "Pizza Sauce", "Italian Herbs"],
    allergens: ["Gluten", "Dairy"],
    nutrition: {
      calories: 320,
      protein: 15,
      carbs: 30,
      fat: 16,
      fiber: 2
    },
    cookTime: "10-12 min",
    spiceLevel: "Mild",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.7,
    reviews: 203,
    popularity: 100,
    featured: true,
    available: true
  },

  {
    name: "BBQ Chicken Deluxe",
    description: "Tender grilled chicken marinated in BBQ sauce, red onions, bell peppers, and mozzarella cheese with a tangy BBQ base.",
    image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400",
    category: "Non-Vegetarian",
    sizes: {
      Small: { price: 1600, diameter: "9 inch" },
      Medium: { price: 2200, diameter: "12 inch" },
      Large: { price: 2800, diameter: "15 inch" }
    },
    basePrice: 2200,
    ingredients: ["Grilled Chicken", "BBQ Sauce", "Red Onions", "Bell Peppers", "Mozzarella"],
    allergens: ["Gluten", "Dairy"],
    nutrition: {
      calories: 350,
      protein: 22,
      carbs: 32,
      fat: 14,
      fiber: 3
    },
    cookTime: "14-16 min",
    spiceLevel: "Medium",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.6,
    reviews: 189,
    popularity: 85,
    featured: false,
    available: true
  },

  // GOURMET PIZZAS
  {
    name: "Truffle Mushroom Gourmet",
    description: "Luxurious pizza featuring wild mushrooms, truffle oil, goat cheese, caramelized onions, and arugula on a thin crispy base.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    category: "Gourmet",
    sizes: {
      Small: { price: 2000, diameter: "9 inch" },
      Medium: { price: 2800, diameter: "12 inch" },
      Large: { price: 3600, diameter: "15 inch" }
    },
    basePrice: 2800,
    ingredients: ["Wild Mushrooms", "Truffle Oil", "Goat Cheese", "Caramelized Onions", "Arugula"],
    allergens: ["Gluten", "Dairy"],
    nutrition: {
      calories: 310,
      protein: 14,
      carbs: 28,
      fat: 18,
      fiber: 4
    },
    cookTime: "16-18 min",
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.9,
    reviews: 87,
    popularity: 70,
    featured: true,
    available: true
  },

  {
    name: "Prosciutto & Fig",
    description: "Sophisticated combination of thinly sliced prosciutto, fresh figs, gorgonzola cheese, honey drizzle, and walnuts.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
    category: "Gourmet",
    sizes: {
      Small: { price: 2200, diameter: "9 inch" },
      Medium: { price: 3000, diameter: "12 inch" },
      Large: { price: 3800, diameter: "15 inch" }
    },
    basePrice: 3000,
    ingredients: ["Prosciutto", "Fresh Figs", "Gorgonzola", "Honey", "Walnuts", "Arugula"],
    allergens: ["Gluten", "Dairy", "Nuts"],
    nutrition: {
      calories: 380,
      protein: 18,
      carbs: 35,
      fat: 20,
      fiber: 3
    },
    cookTime: "14-16 min",
    spiceLevel: "Mild",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.8,
    reviews: 64,
    popularity: 60,
    featured: false,
    available: true
  },

  // VEGETARIAN DELIGHTS
  {
    name: "Mediterranean Veggie",
    description: "Fresh vegetables including roasted eggplant, zucchini, bell peppers, olives, feta cheese, and sun-dried tomatoes.",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400",
    category: "Vegetarian",
    sizes: {
      Small: { price: 1500, diameter: "9 inch" },
      Medium: { price: 2100, diameter: "12 inch" },
      Large: { price: 2700, diameter: "15 inch" }
    },
    basePrice: 2100,
    ingredients: ["Roasted Eggplant", "Zucchini", "Bell Peppers", "Kalamata Olives", "Feta", "Sun-dried Tomatoes"],
    allergens: ["Gluten", "Dairy"],
    nutrition: {
      calories: 290,
      protein: 13,
      carbs: 35,
      fat: 12,
      fiber: 5
    },
    cookTime: "13-15 min",
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.5,
    reviews: 142,
    popularity: 75,
    featured: false,
    available: true
  },

  {
    name: "Spinach & Ricotta White",
    description: "Creamy white sauce base topped with fresh spinach, ricotta cheese, mozzarella, garlic, and a hint of nutmeg.",
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f07df?w=400",
    category: "Vegetarian",
    sizes: {
      Small: { price: 1400, diameter: "9 inch" },
      Medium: { price: 1900, diameter: "12 inch" },
      Large: { price: 2500, diameter: "15 inch" }
    },
    basePrice: 1900,
    ingredients: ["Fresh Spinach", "Ricotta Cheese", "Mozzarella", "Garlic", "White Sauce", "Nutmeg"],
    allergens: ["Gluten", "Dairy"],
    nutrition: {
      calories: 270,
      protein: 15,
      carbs: 30,
      fat: 11,
      fiber: 3
    },
    cookTime: "12-14 min",
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.4,
    reviews: 98,
    popularity: 65,
    featured: false,
    available: true
  },

  // SPICY OPTIONS
  {
    name: "Spicy Devil's Pizza",
    description: "For heat lovers! Spicy salami, jalapeños, hot peppers, red chili flakes, mozzarella, and our fiery hot sauce.",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400",
    category: "Spicy",
    sizes: {
      Small: { price: 1700, diameter: "9 inch" },
      Medium: { price: 2300, diameter: "12 inch" },
      Large: { price: 2900, diameter: "15 inch" }
    },
    basePrice: 2300,
    ingredients: ["Spicy Salami", "Jalapeños", "Hot Peppers", "Red Chili Flakes", "Mozzarella", "Hot Sauce"],
    allergens: ["Gluten", "Dairy"],
    nutrition: {
      calories: 340,
      protein: 16,
      carbs: 30,
      fat: 18,
      fiber: 2
    },
    cookTime: "11-13 min",
    spiceLevel: "Very Hot",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.3,
    reviews: 121,
    popularity: 55,
    featured: false,
    available: true
  },

  {
    name: "Chicken Tikka Masala",
    description: "Fusion pizza with tandoori chicken, tikka masala sauce, red onions, bell peppers, cilantro, and mozzarella.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
    category: "Spicy",
    sizes: {
      Small: { price: 1800, diameter: "9 inch" },
      Medium: { price: 2400, diameter: "12 inch" },
      Large: { price: 3000, diameter: "15 inch" }
    },
    basePrice: 2400,
    ingredients: ["Tandoori Chicken", "Tikka Masala Sauce", "Red Onions", "Bell Peppers", "Cilantro", "Mozzarella"],
    allergens: ["Gluten", "Dairy"],
    nutrition: {
      calories: 360,
      protein: 24,
      carbs: 32,
      fat: 16,
      fiber: 3
    },
    cookTime: "15-17 min",
    spiceLevel: "Hot",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.6,
    reviews: 176,
    popularity: 80,
    featured: true,
    available: true
  },

  // VEGAN OPTIONS
  {
    name: "Vegan Garden Supreme",
    description: "Plant-based paradise with vegan cheese, roasted vegetables, mushrooms, spinach, and dairy-free pesto sauce.",
    image: "https://images.unsplash.com/photo-1571066811602-716837d681de?w=400",
    category: "Vegan",
    sizes: {
      Small: { price: 1600, diameter: "9 inch" },
      Medium: { price: 2200, diameter: "12 inch" },
      Large: { price: 2800, diameter: "15 inch" }
    },
    basePrice: 2200,
    ingredients: ["Vegan Cheese", "Roasted Vegetables", "Mushrooms", "Spinach", "Dairy-free Pesto"],
    allergens: ["Gluten"],
    nutrition: {
      calories: 250,
      protein: 10,
      carbs: 35,
      fat: 8,
      fiber: 6
    },
    cookTime: "14-16 min",
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    rating: 4.2,
    reviews: 89,
    popularity: 45,
    featured: false,
    available: true
  },

  // GLUTEN-FREE OPTIONS
  {
    name: "Gluten-Free Margherita",
    description: "Classic Margherita on our special gluten-free cauliflower crust with fresh mozzarella, tomatoes, and basil.",
    image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400",
    category: "Gluten-Free",
    sizes: {
      Small: { price: 1500, diameter: "9 inch" },
      Medium: { price: 2100, diameter: "12 inch" },
      Large: { price: 2700, diameter: "15 inch" }
    },
    basePrice: 2100,
    ingredients: ["Cauliflower Crust", "Fresh Mozzarella", "Tomatoes", "Fresh Basil", "Olive Oil"],
    allergens: ["Dairy"],
    nutrition: {
      calories: 220,
      protein: 12,
      carbs: 20,
      fat: 10,
      fiber: 4
    },
    cookTime: "16-18 min",
    spiceLevel: "Mild",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    rating: 4.4,
    reviews: 67,
    popularity: 40,
    featured: false,
    available: true
  },

  // MEAT LOVERS
  {
    name: "Meat Lovers Supreme",
    description: "The ultimate carnivore's dream with pepperoni, sausage, ham, bacon, ground beef, and extra mozzarella cheese.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
    category: "Non-Vegetarian",
    sizes: {
      Small: { price: 2000, diameter: "9 inch" },
      Medium: { price: 2800, diameter: "12 inch" },
      Large: { price: 3600, diameter: "15 inch" }
    },
    basePrice: 2800,
    ingredients: ["Pepperoni", "Italian Sausage", "Ham", "Bacon", "Ground Beef", "Mozzarella"],
    allergens: ["Gluten", "Dairy"],
    nutrition: {
      calories: 420,
      protein: 25,
      carbs: 30,
      fat: 24,
      fiber: 2
    },
    cookTime: "15-17 min",
    spiceLevel: "Medium",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.5,
    reviews: 145,
    popularity: 90,
    featured: true,
    available: true
  },

  // SEAFOOD
  {
    name: "Seafood Special",
    description: "Ocean's finest with shrimp, calamari, mussels, garlic, white wine sauce, and a hint of lemon zest.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    category: "Non-Vegetarian",
    sizes: {
      Small: { price: 2200, diameter: "9 inch" },
      Medium: { price: 3000, diameter: "12 inch" },
      Large: { price: 3800, diameter: "15 inch" }
    },
    basePrice: 3000,
    ingredients: ["Shrimp", "Calamari", "Mussels", "Garlic", "White Wine Sauce", "Lemon Zest", "Mozzarella"],
    allergens: ["Gluten", "Dairy", "Shellfish"],
    nutrition: {
      calories: 310,
      protein: 22,
      carbs: 28,
      fat: 12,
      fiber: 2
    },
    cookTime: "14-16 min",
    spiceLevel: "Mild",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.3,
    reviews: 73,
    popularity: 35,
    featured: false,
    available: true
  },

  // DESSERT PIZZA
  {
    name: "Chocolate Hazelnut Dessert",
    description: "Sweet ending to your meal! Nutella spread, fresh strawberries, bananas, powdered sugar, and a drizzle of chocolate.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    category: "Dessert",
    sizes: {
      Small: { price: 1200, diameter: "9 inch" },
      Medium: { price: 1600, diameter: "12 inch" },
      Large: { price: 2000, diameter: "15 inch" }
    },
    basePrice: 1600,
    ingredients: ["Nutella", "Fresh Strawberries", "Bananas", "Powdered Sugar", "Chocolate Drizzle"],
    allergens: ["Gluten", "Dairy", "Nuts"],
    nutrition: {
      calories: 380,
      protein: 8,
      carbs: 55,
      fat: 16,
      fiber: 4
    },
    cookTime: "8-10 min",
    spiceLevel: "Sweet",
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    rating: 4.7,
    reviews: 112,
    popularity: 70,
    featured: false,
    available: true
  }
];

async function seedPizzas() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected to MongoDB');

    // Clear existing pizzas (optional)
    await Pizza.deleteMany({});
    console.log('🗑️  Cleared existing pizzas');

    // Insert new pizzas
    const result = await Pizza.insertMany(pizzaData);
    console.log(`🍕 Successfully added ${result.length} pizzas to the menu!`);

    // Display summary
    const categories = [...new Set(pizzaData.map(p => p.category))];
    console.log('\n📊 Pizza Menu Summary:');
    console.log('====================');
    categories.forEach(category => {
      const count = pizzaData.filter(p => p.category === category).length;
      console.log(`${category}: ${count} pizzas`);
    });

    console.log('\n🎯 Featured Pizzas:');
    pizzaData.filter(p => p.featured).forEach(pizza => {
      console.log(`- ${pizza.name} (${pizza.category}) - LKR ${pizza.basePrice}`);
    });

    console.log('\n💰 Price Range:');
    const prices = pizzaData.map(p => p.basePrice).sort((a, b) => a - b);
    console.log(`Lowest: LKR ${prices[0]} | Highest: LKR ${prices[prices.length - 1]}`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedPizzas();