// Export all schemas from this folder
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const Tenant = require('./Tenant');
const ClerkUser = require('./ClerkUser');

module.exports = {
  User,
  Product,
  Order,
  Tenant,
  ClerkUser,
};
