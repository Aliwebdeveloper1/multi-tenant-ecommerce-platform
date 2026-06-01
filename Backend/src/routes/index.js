const express = require('express');
const router = express.Router();

// Import route modules
const healthRoutes = require('./healthRoutes');

// Use routes
router.use('/health', healthRoutes);

// Add more route imports here
router.use('/auth', require('./authRoutes'));
// additional feature route groups
// router.use('/users', require('./userRoutes'));
router.use('/products', require('./productRoutes'));

module.exports = router;
