// utils/seedPizzas.js - Database seeder for sample pizzas

const mongoose = require('mongoose');

// Pizza model schema (adjust if your model is different)
const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: String,
  image: String,
  price: {
    small: { type: Number, required: true },
    medium: { type: Number, required: true },
    large: { type: Number, required: true }
  },
  ingredients: [String],
  allergens: [String],
  isVegetarian: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  preparationTime: Number,
  calories: {
    small: Number,
    medium: Number,
    large: Number
  },
  spiceLevel: String
}, {
  timestamps: true
});

const Pizza = mongoose.model('Pizza', pizzaSchema);

const samplePizzas = [
  {
    name: "Margherita Classic",
    description: "Fresh mozzarella, tomato sauce, basil, and olive oil on our signature crust",
    category: "Vegetarian",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500",
    price: {
      small: 990,
      medium: 1290,
      large: 1590
    },
    ingredients: ["Mozzarella", "Tomato Sauce", "Fresh Basil", "Olive Oil"],
    allergens: ["Dairy", "Gluten"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    preparationTime: 15,
    calories: {
      small: 220,
      medium: 280,
      large: 340
    }
  },
  {
    name: "Pepperoni Supreme",
    description: "Premium pepperoni, mozzarella cheese, and our special tomato sauce",
    category: "Meat Lovers",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
    price: {
      small: 1290,
      medium: 1590,
      large: 1890
    },
    ingredients: ["Pepperoni", "Mozzarella", "Tomato Sauce"],
    allergens: ["Dairy", "Gluten"],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    preparationTime: 18,
    calories: {
      small: 280,
      medium: 350,
      large: 420
    }
  },
  {
    name: "BBQ Chicken Delight",
    description: "Grilled chicken, BBQ sauce, red onions, mozzarella, and cilantro",
    category: "Chicken",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
    price: {
      small: 1490,
      medium: 1790,
      large: 2090
    },
    ingredients: ["Grilled Chicken", "BBQ Sauce", "Red Onions", "Mozzarella", "Cilantro"],
    allergens: ["Dairy", "Gluten"],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    preparationTime: 20,
    calories: {
      small: 310,
      medium: 380,
      large: 450
    }
  },
  {
    name: "Veggie Garden",
    description: "Bell peppers, mushrooms, onions, tomatoes, olives, and mozzarella",
    category: "Vegetarian",
    image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=500",
    price: {
      small: 1190,
      medium: 1490,
      large: 1790
    },
    ingredients: ["Bell Peppers", "Mushrooms", "Onions", "Tomatoes", "Olives", "Mozzarella"],
    allergens: ["Dairy", "Gluten"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    preparationTime: 16,
    calories: {
      small: 200,
      medium: 260,
      large: 320
    }
  },
  {
    name: "Meat Lovers Special",
    description: "Pepperoni, sausage, ham, bacon, and extra mozzarella cheese",
    category: "Meat Lovers",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
    price: {
      small: 1690,
      medium: 1990,
      large: 2290
    },
    ingredients: ["Pepperoni", "Italian Sausage", "Ham", "Bacon", "Mozzarella"],
    allergens: ["Dairy", "Gluten"],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    preparationTime: 22,
    calories: {
      small: 380,
      medium: 450,
      large: 520
    }
  },
  {
    name: "Hawaiian Paradise",
    description: "Ham, pineapple, mozzarella cheese, and tomato sauce",
    category: "Specialty",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
    price: {
      small: 1390,
      medium: 1690,
      large: 1990
    },
    ingredients: ["Ham", "Pineapple", "Mozzarella", "Tomato Sauce"],
    allergens: ["Dairy", "Gluten"],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    preparationTime: 17,
    calories: {
      small: 250,
      medium: 320,
      large: 390
    }
  },
  {
    name: "Spicy Buffalo Chicken",
    description: "Buffalo chicken, hot sauce, ranch dressing, celery, and mozzarella",
    category: "Spicy",
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=500",
    price: {
      small: 1590,
      medium: 1890,
      large: 2190
    },
    ingredients: ["Buffalo Chicken", "Hot Sauce", "Ranch Dressing", "Celery", "Mozzarella"],
    allergens: ["Dairy", "Gluten"],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    preparationTime: 19,
    calories: {
      small: 320,
      medium: 390,
      large: 460
    },
    spiceLevel: "Hot"
  },
  {
    name: "Four Cheese Deluxe",
    description: "Mozzarella, cheddar, parmesan, and goat cheese with herbs",
    category: "Cheese Lovers",
    image: "https://images.unsplash.com/photo-1548369937-47519962c11a?w=500",
    price: {
      small: 1490,
      medium: 1790,
      large: 2090
    },
    ingredients: ["Mozzarella", "Cheddar", "Parmesan", "Goat Cheese", "Italian Herbs"],
    allergens: ["Dairy", "Gluten"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    preparationTime: 16,
    calories: {
      small: 290,
      medium: 360,
      large: 430
    }
  }
];

const seedPizzas = async () => {
  try {
    console.log('🍕 Starting pizza database seeding...');
    
    // Clear existing pizzas (optional)
    await Pizza.deleteMany({});
    console.log('✅ Cleared existing pizzas');
    
    // Insert sample pizzas
    const createdPizzas = await Pizza.insertMany(samplePizzas);
    console.log(`✅ Successfully created ${createdPizzas.length} pizzas`);
    
    // Display created pizzas with their IDs
    console.log('\n📋 Created Pizzas:');
    createdPizzas.forEach((pizza, index) => {
      console.log(`${index + 1}. ${pizza.name}`);
      console.log(`   ID: ${pizza._id}`);
      console.log(`   Price (Large): Rs. ${pizza.price.large}`);
      console.log('');
    });
    
    return createdPizzas;
  } catch (error) {
    console.error('❌ Error seeding pizzas:', error);
    throw error;
  }
};

// If running this file directly
if (require.main === module) {
  const runSeeder = async () => {
    try {
      // Connect to MongoDB directly
      const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://chamikadenuwan344:ulfeWV2vJ3VFYc0b@cluster0.m23csee.mongodb.net/'; // Update with your MongoDB URI
      
      console.log('🔌 Connecting to MongoDB...');
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Connected to MongoDB');
      
      await seedPizzas();
      console.log('🎉 Pizza seeding completed successfully!');
      
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
      process.exit(0);
    } catch (error) {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    }
  };
  
  runSeeder();
}

module.exports = { seedPizzas, samplePizzas };