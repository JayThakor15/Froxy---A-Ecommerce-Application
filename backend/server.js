const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Load environment variables
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());

// Webhook route must come before express.json() middleware
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }), require('./routes/payments').webhookHandler);

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Payments routes (excluding webhook which is handled above)
const paymentsRouter = require('./routes/payments');
app.use('/api/payments', (req, res, next) => {
  if (req.path === '/webhook') {
    return next(); // Skip this route, webhook is handled above
  }
  paymentsRouter(req, res, next);
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
