// server.js - MINIMAL VERSION FOR DEBUGGING
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const pizzaRoutes = require('./routes/pizzaRoutes');
const cartRoutes = require('./routes/cartRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { orderRoutes, addressRoutes } = require('./routes/orderRoutes');

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
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/addresses', addressRoutes);



mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => {
    console.log(`✅ Server running at http://localhost:${process.env.PORT}`);
  }))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Error handler (should be after all routes)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});