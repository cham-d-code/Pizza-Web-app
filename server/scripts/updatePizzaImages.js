// Script to update pizza images in MongoDB with local photos
const mongoose = require('mongoose');
const Pizza = require('../models/Pizza');
require('dotenv').config();

const imageMapping = {
  'Margherita': '/Margherita.jpg',
  'Pepperoni': '/Pepperoni.jpg', 
  'Veggie Supreme': '/Veggie Supreme.jpg',
  'Chicken BBQ': '/Chicken BBQ.jpg',
  'Vegan Delight': '/Vegan Delight.jpg',
  'Tandoori Chicken': '/Chilli Chicken Pizza.jpg', // Similar style
  'Spicy Paneer': '/Veggie Masala.jpg', // Similar style
  'Buffalo Chicken': '/sausage Delight.jpg', // Similar style
  // You can add more mappings here - uncomment and run script again:
  'Hawaiian': '/Margherita.jpg', // Use as fallback
  'Four Cheese': '/Margherita.jpg', // Use as fallback  
  'Mushroom Feast': '/Veggie Supreme.jpg', // Use as fallback
  'Classic Cheese': '/Margherita.jpg', // Use as fallback
  'Garden Fresh': '/Veggie Supreme.jpg', // Use as fallback
  'Meat Lovers': '/Pepperoni.jpg', // Use as fallback
  // Add more mappings as needed
};

async function updatePizzaImages() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🔄 Fetching all pizzas...');
    const pizzas = await Pizza.find({});
    console.log(`📋 Found ${pizzas.length} pizzas in database`);

    let updatedCount = 0;
    
    for (const pizza of pizzas) {
      const localImage = imageMapping[pizza.name];
      
      if (localImage) {
        console.log(`🔄 Updating ${pizza.name} image...`);
        await Pizza.findByIdAndUpdate(pizza._id, { 
          image: localImage 
        });
        console.log(`✅ Updated ${pizza.name}: ${localImage}`);
        updatedCount++;
      } else {
        console.log(`⚠️  No local image found for ${pizza.name}, keeping current image`);
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} pizza images!`);
    console.log('\nAvailable photos not yet mapped:');
    console.log('- Chilli Chicken Pizza.jpg');
    console.log('- Veggie Masala.jpg'); 
    console.log('- sausage Delight.jpg');
    
    console.log('\nTo add more mappings, edit the imageMapping object in this script.');

  } catch (error) {
    console.error('❌ Error updating pizza images:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit();
  }
}

// Run the script
if (require.main === module) {
  updatePizzaImages();
}

module.exports = { updatePizzaImages, imageMapping };