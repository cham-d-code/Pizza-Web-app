// server/server.js

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Enable Cross-Origin Resource Sharing for frontend to connect
app.use(cors());

// Enable JSON parsing for incoming requests
app.use(express.json());

// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
})
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err.message);
});

// Use user-related routes (register, login, verify-otp)
app.use('/api/users', userRoutes);

// Default route to test the server
app.get('/', (req, res) => {
  res.send('🍕 Pizza Delivery Backend is Running!');
});

// Start the server on PORT from .env or default 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
