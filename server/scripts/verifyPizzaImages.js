const mongoose = require('mongoose');
const Pizza = require('../models/Pizza');
require('dotenv').config();

async function verifyImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const pizzas = await Pizza.find({}).sort({name: 1});
    
    console.log('Pizza Image Status:');
    console.log('==================');
    
    pizzas.forEach(pizza => {
      const isLocal = pizza.image.startsWith('/');
      const status = isLocal ? '✅ LOCAL' : '🔗 REMOTE';
      console.log(`${status} ${pizza.name}: ${pizza.image}`);
    });
    
    const localCount = pizzas.filter(p => p.image.startsWith('/')).length;
    const remoteCount = pizzas.filter(p => !p.image.startsWith('/')).length;
    
    console.log('\nSummary:');
    console.log(`✅ Local images: ${localCount}`);
    console.log(`🔗 Remote images: ${remoteCount}`);
    console.log(`📊 Total pizzas: ${pizzas.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

verifyImages();