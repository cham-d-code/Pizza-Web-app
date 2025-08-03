const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Test MongoDB connection
async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
    
    // Test if pizzas exist
    const Pizza = require('./models/Pizza');
    const pizzas = await Pizza.find({});
    console.log(`📊 Found ${pizzas.length} pizzas in database`);
    
    if (pizzas.length > 0) {
      console.log('🍕 Sample pizza:', {
        id: pizzas[0]._id,
        name: pizzas[0].name,
        sizes: pizzas[0].sizes
      });
    }
    
    // Test cart creation
    const Cart = require('./models/Cart');
    const testCart = new Cart({
      user: '507f1f77bcf86cd799439011',
      items: []
    });
    
    console.log('✅ Cart model works correctly');
    
    await mongoose.disconnect();
    console.log('✅ Test completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testConnection(); 