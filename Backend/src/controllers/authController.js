const { createClerkClient } = require("@clerk/backend");
const { ClerkUser } = require("../models");

const client = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * Get current authenticated user info
 */
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Get Clerk user details
    const clerkUser = await client.users.getUser(userId);

    // Check if user exists in our database
    let dbUser = await ClerkUser.findOne({ clerkId: userId });

    if (!dbUser) {
      // Create user in DB if first time login
      const email =
        clerkUser.emailAddresses?.[0]?.emailAddress || clerkUser.username;
      const name = clerkUser.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
        : clerkUser.username;

      dbUser = new ClerkUser({
        clerkId: userId,
        email,
        name,
        avatar: clerkUser.imageUrl,
        provider: clerkUser.externalAccounts?.[0]?.provider || "email",
        isActive: true,
      });

      await dbUser.save();
    }

    res.status(200).json({
      clerkUser: {
        id: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress,
        username: clerkUser.username,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
        createdAt: clerkUser.createdAt,
      },
      dbUser,
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

/**
 * Sign up with email/username
 */
const signupWithEmail = async (req, res) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Create user in Clerk
    const clerkUser = await client.users.createUser({
      emailAddress: [email],
      username,
      password,
      firstName,
      lastName,
    });

    // Create user in database
    const dbUser = new ClerkUser({
      clerkId: clerkUser.id,
      email,
      name: `${firstName || ""} ${lastName || ""}`.trim() || username,
      username,
      avatar: clerkUser.imageUrl,
      provider: "email",
      isActive: true,
    });

    await dbUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: clerkUser.id,
        email,
        username,
        name: dbUser.name,
      },
    });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(400).json({ message: error.message || "Signup failed" });
  }
};

/**
 * Sign in with email/username
 */
const signinWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Note: Clerk handles the actual sign-in on the client side
    // This endpoint is for reference - actual auth token is managed by Clerk
    res.status(200).json({
      message: "Check Clerk client documentation for sign-in flow",
      instruction:
        "Use Clerk's frontend SDK for email/password authentication",
    });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(400).json({ message: error.message || "Signin failed" });
  }
};

/**
 * Handle OAuth callback (Google, Facebook, etc.)
 */
const handleOAuthCallback = async (req, res) => {
  try {
    const { clerkUserId } = req.body;

    if (!clerkUserId) {
      return res.status(400).json({ message: "Clerk user ID is required" });
    }

    // Get OAuth user from Clerk
    const clerkUser = await client.users.getUser(clerkUserId);

    // Get OAuth provider info
    const provider =
      clerkUser.externalAccounts?.[0]?.provider || "unknown";
    const email =
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      `${provider}-${clerkUser.id}@clerk.dev`;

    // Check if user exists in DB
    let dbUser = await ClerkUser.findOne({ clerkId: clerkUserId });

    if (!dbUser) {
      // Create new user
      dbUser = new ClerkUser({
        clerkId: clerkUserId,
        email,
        name:
          clerkUser.firstName && clerkUser.lastName
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser.firstName || clerkUser.username || email,
        avatar: clerkUser.imageUrl,
        provider,
        isActive: true,
      });

      await dbUser.save();
    } else {
      // Update user info if OAuth has new data
      if (clerkUser.imageUrl && !dbUser.avatar) {
        dbUser.avatar = clerkUser.imageUrl;
        await dbUser.save();
      }
    }

    res.status(200).json({
      message: `${provider} authentication successful`,
      user: dbUser,
    });
  } catch (error) {
    console.error("Error handling OAuth callback:", error);
    res.status(400).json({ message: error.message || "OAuth callback failed" });
  }
};

/**
 * Logout
 */
const logout = async (req, res) => {
  try {
    // Note: Actual logout is handled by Clerk on the client
    // This is just a backend endpoint for session cleanup if needed
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(400).json({ message: "Logout failed" });
  }
};

module.exports = {
  getCurrentUser,
  signupWithEmail,
  signinWithEmail,
  handleOAuthCallback,
  logout,
};
