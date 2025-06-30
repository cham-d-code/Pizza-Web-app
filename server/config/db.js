const mongoose = require('mongoose');

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // If successful, log the connection host (MongoDB server's address)
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If there's an error, log the error message and exit the process
    console.error(`Error: ${error.message}`);
    process.exit(1);  // Exit with failure code
  }
};

// Export the function so it can be used in server.js
module.exports = connectDB;
