const { clerkMiddleware, requireAuth } = require('@clerk/express');

// Clerk middleware - runs on all requests, makes user info available
const clerkAuth = clerkMiddleware();

// Middleware that requires authentication
const requireClerkAuth = requireAuth();

module.exports = {
  clerkAuth,
  requireClerkAuth,
};
