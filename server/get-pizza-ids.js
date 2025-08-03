const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function getPizzaIds() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
    
    const Pizza = require('./models/Pizza');
    const pizzas = await Pizza.find({});
    
    console.log('🍕 Available Pizzas:');
    pizzas.forEach((pizza, index) => {
      console.log(`${index + 1}. ${pizza.name} - ID: ${pizza._id}`);
      console.log(`   Sizes: ${pizza.sizes.map(s => `${s.size}: LKR ${s.price}`).join(', ')}`);
      console.log('');
    });
    
    // Find the specific pizzas we need
    const targetPizzas = ['Sausage Delight', 'Margherita', 'Chilli Chicken Pizza', 'Veggie Masala Pizza'];
    
    console.log('🎯 Target Pizzas for Frontend:');
    targetPizzas.forEach(name => {
      const pizza = pizzas.find(p => p.name === name);
      if (pizza) {
        console.log(`${name}: "${pizza._id}"`);
      } else {
        console.log(`${name}: NOT FOUND`);
      }
    });
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getPizzaIds(); 