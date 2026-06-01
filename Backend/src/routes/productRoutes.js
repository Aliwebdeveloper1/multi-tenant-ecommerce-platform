const express = require('express');
const router = express.Router();
const { addProduct, updateProduct, getProduct, listProducts } = require('../controllers/productController');
const { requireClerkAuth } = require('../middleware/clerk');

// list all products or filter by tenant
router.get('/', listProducts);

// retrieve single product
router.get('/:id', getProduct);

// Create product (requires authentication)
router.post('/', requireClerkAuth, addProduct);

// Update product by ID
router.put('/:id', requireClerkAuth, updateProduct);

module.exports = router;
