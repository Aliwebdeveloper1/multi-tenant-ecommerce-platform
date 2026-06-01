// Re-export all schemas from schemas folder for easy access
const { User, Product, Order, Tenant } = require('./schemas');
const ClerkUser = require('./schemas/ClerkUser');

module.exports = {
  User,
  Product,
  Order,
  Tenant,
  ClerkUser,
};
