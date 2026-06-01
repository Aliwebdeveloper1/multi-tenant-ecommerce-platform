const Product = require('../models').Product;

// helper slug generator
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Create a new product
const addProduct = async (req, res) => {
  try {
    const data = { ...req.body };

    // if tenantId isn't supplied, try to infer from authenticated user
    // Clerk authentication populates req.auth with { userId, sessionId }
    if (!data.tenantId && req.auth && req.auth.userId) {
      // TODO: look up the tenant for this clerk user (e.g. via User/ClerkUser model)
      // For now we require the client to send the correct tenantId explicitly.
    }

    if (!data.tenantId) {
      return res.status(400).json({ message: 'tenantId is required' });
    }

    if (!data.slug && data.name) {
      data.slug = slugify(data.name);
    }

    const product = new Product(data);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    // handle duplicate slug error
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: 'A product with that slug already exists' });
    }
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// Update existing product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Protect tenantId from being changed by client
    delete updates.tenantId;

    if (updates.name && !updates.slug) {
      updates.slug = slugify(updates.name);
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // optional: ensure user has access to this tenant - placeholder
    // if you track tenant information on your authenticated user record you can
    // compare it here and reject mismatches. Clerk users are available via
    // `req.auth.userId`, so you might query your own User/ClerkUser collection.
    //
    // Example:
    // const myUser = await ClerkUser.findOne({ clerkId: req.auth.userId });
    // if (myUser && myUser.tenantId && product.tenantId.toString() !== myUser.tenantId.toString()) {
    //   return res.status(403).json({ message: 'Not authorized to modify this product' });
    // }
    
    // TODO: enforce tenant ownership if necessary


    Object.assign(product, updates);
    await product.save();

    res.json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: 'A product with that slug already exists' });
    }
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// fetch single product by ID
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// list products, optionally filtered by tenantId
const listProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.tenantId) filter.tenantId = req.query.tenantId;
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error('Error listing products:', error);
    res.status(500).json({ message: 'Failed to list products' });
  }
};

module.exports = {
  addProduct,
  updateProduct,
  getProduct,
  listProducts,
};
