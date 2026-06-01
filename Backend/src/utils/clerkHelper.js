const { createClerkClient } = require("@clerk/backend");
const { ClerkUser } = require("../models");

const client = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * Get user from Clerk
 */
const getClerkUser = async (clerkUserId) => {
  try {
    return await client.users.getUser(clerkUserId);
  } catch (error) {
    console.error("Error fetching Clerk user:", error);
    return null;
  }
};

/**
 * Create user in Clerk
 */
const createClerkUser = async (userData) => {
  try {
    return await client.users.createUser(userData);
  } catch (error) {
    console.error("Error creating Clerk user:", error);
    throw error;
  }
};

/**
 * Update user in Clerk
 */
const updateClerkUser = async (clerkUserId, userData) => {
  try {
    return await client.users.updateUser(clerkUserId, userData);
  } catch (error) {
    console.error("Error updating Clerk user:", error);
    throw error;
  }
};

/**
 * Delete user from Clerk
 */
const deleteClerkUser = async (clerkUserId) => {
  try {
    return await client.users.deleteUser(clerkUserId);
  } catch (error) {
    console.error("Error deleting Clerk user:", error);
    throw error;
  }
};

/**
 * Sync Clerk user to database
 */
const syncUserToDatabase = async (clerkUser) => {
  try {
    const email =
      clerkUser.emailAddresses?.[0]?.emailAddress || clerkUser.username;
    const name = clerkUser.firstName
      ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
      : clerkUser.username;
    const provider =
      clerkUser.externalAccounts?.[0]?.provider || "email";

    // Find or create user
    let dbUser = await ClerkUser.findOne({ clerkId: clerkUser.id });

    if (!dbUser) {
      dbUser = new ClerkUser({
        clerkId: clerkUser.id,
        email,
        name,
        avatar: clerkUser.imageUrl,
        provider,
        isActive: true,
      });
    } else {
      // Update existing user
      dbUser.name = name;
      dbUser.avatar = clerkUser.imageUrl || dbUser.avatar;
      dbUser.metadata.lastLogin = new Date();
      dbUser.metadata.loginCount = (dbUser.metadata.loginCount || 0) + 1;
    }

    await dbUser.save();
    return dbUser;
  } catch (error) {
    console.error("Error syncing user to database:", error);
    throw error;
  }
};

/**
 * Get OAuth provider info
 */
const getOAuthProvider = (clerkUser) => {
  const externalAccount = clerkUser.externalAccounts?.[0];
  if (!externalAccount) return null;

  return {
    provider: externalAccount.provider,
    externalId: externalAccount.externalId,
    email: externalAccount.emailAddress,
  };
};

module.exports = {
  getClerkUser,
  createClerkUser,
  updateClerkUser,
  deleteClerkUser,
  syncUserToDatabase,
  getOAuthProvider,
};
