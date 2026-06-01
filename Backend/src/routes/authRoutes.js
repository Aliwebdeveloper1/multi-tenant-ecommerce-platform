const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { requireClerkAuth } = require("../middleware/clerk");

// Public routes
router.post("/signup", authController.signupWithEmail);
router.post("/signin", authController.signinWithEmail);
router.post("/oauth-callback", authController.handleOAuthCallback);

// Protected routes
router.get("/me", requireClerkAuth, authController.getCurrentUser);
router.post("/logout", requireClerkAuth, authController.logout);

module.exports = router;
