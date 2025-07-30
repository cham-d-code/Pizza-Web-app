// server.js - MINIMAL VERSION FOR DEBUGGING
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const pizzaRoutes = require('./routes/pizzaRoutes');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.use('/api/users', userRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/cart', cartRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => {
    console.log(`✅ Server running at http://localhost:${process.env.PORT}`);
  }))
  .catch(err => console.error('❌ MongoDB Error:', err));