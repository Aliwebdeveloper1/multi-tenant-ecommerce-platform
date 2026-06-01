# Models Folder Structure

## Organization

```
src/models/
├── index.js                 # Main export file (re-exports all schemas)
└── schemas/
    ├── index.js            # Exports all schema models
    ├── User.js             # User schema & model
    ├── Product.js          # Product schema & model
    ├── Order.js            # Order schema & model
    └── Tenant.js           # Tenant/Store schema & model
```

## Usage

### Import from models folder (recommended for controllers/services)
```javascript
const { User, Product, Order, Tenant } = require('../models');

// or individual imports
const User = require('../models').User;
```

### Import directly from schemas subfolder (also works)
```javascript
const { User, Product, Order, Tenant } = require('../models/schemas');
```

## Schema Details

### Tenant Schema
- Multi-tenant support - represents a store/seller
- Fields: name, slug, logo, subscription, settings, etc.

### User Schema
- Tied to Tenant (tenantId)
- Roles: admin, manager, staff, customer
- Password hashing with bcryptjs
- Methods: comparePassword()

### Product Schema
- Belongs to Tenant
- Supports variants (colors, sizes, etc.)
- Fields: name, description, category, price, stock, images, etc.

### Order Schema
- Links User and Tenant
- Contains order items with product snapshots
- Tracks payment and shipping info
- Auto-generates unique orderNumber per tenant

## Adding New Schemas

1. Create a new file in `schemas/` folder (e.g., `Review.js`)
2. Define your Mongoose schema and export the model
3. Add export to `schemas/index.js`
4. The schema will automatically be available via main `models/index.js`

Example:
```javascript
// schemas/Review.js
const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
```

Then update `schemas/index.js`:
```javascript
const Review = require('./Review');
module.exports = { User, Product, Order, Tenant, Review };
```
