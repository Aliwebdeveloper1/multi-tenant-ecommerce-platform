# Clerk Authentication Setup Guide

## Overview
This backend is set up with Clerk authentication supporting:
1. **Email/Username** - Traditional sign-up and sign-in
2. **Google OAuth** - Sign-in with Google
3. **Facebook OAuth** - Sign-in with Facebook

---

## Backend API Endpoints

### Public Routes

#### 1. Sign Up with Email
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_xxx",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe"
  }
}
```

---

#### 2. Sign In with Email
```bash
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

> **Note**: Actual authentication is handled by Clerk's frontend SDK. This endpoint is for reference.

---

#### 3. OAuth Callback (Google/Facebook)
```bash
POST /api/auth/oauth-callback
Content-Type: application/json

{
  "clerkUserId": "user_xxx"
}
```

**Response:**
```json
{
  "message": "google authentication successful",
  "user": {
    "clerkId": "user_xxx",
    "email": "user@example.com",
    "name": "John Doe",
    "provider": "google",
    "avatar": "https://..."
  }
}
```

---

### Protected Routes (Require Authentication)

#### 4. Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <clerk-token>
```

**Response:**
```json
{
  "clerkUser": {
    "id": "user_xxx",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "imageUrl": "https://..."
  },
  "dbUser": {
    "_id": "db-id",
    "clerkId": "user_xxx",
    "email": "user@example.com",
    ...
  }
}
```

---

#### 5. Logout
```bash
POST /api/auth/logout
Authorization: Bearer <clerk-token>
```

---

## Frontend Setup (Next.js / React)

### 1. Install Clerk
```bash
npm install @clerk/nextjs
# or for React
npm install @clerk/react
```

### 2. Set Up Environment Variables
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### 3. Wrap App with ClerkProvider (Next.js)

**app/layout.tsx:**
```tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 4. Create Sign-In Page

**app/sign-in/page.tsx:**
```tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return <SignIn />;
}
```

### 5. Create Sign-Up Page

**app/sign-up/page.tsx:**
```tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return <SignUp />;
}
```

### 6. Access User Info in Components

```tsx
'use client';

import { useUser } from '@clerk/nextjs';

export default function Dashboard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user?.firstName}</h1>
      <p>{user?.emailAddresses[0].emailAddress}</p>
    </div>
  );
}
```

### 7. Call Backend API with Auth Token

```tsx
'use client';

import { useAuth } from '@clerk/nextjs';

export default function MyComponent() {
  const { getToken } = useAuth();

  const fetchUserFromBackend = async () => {
    const token = await getToken();

    const response = await fetch(
      'http://localhost:5000/api/auth/me',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    console.log(data);
  };

  return (
    <button onClick={fetchUserFromBackend}>
      Fetch User Profile
    </button>
  );
}
```

---

## Configure OAuth Providers

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/sign-up`
   - `http://localhost:3000/sign-in`
   - `https://yourdomain.com/sign-up`
   - `https://yourdomain.com/sign-in`
6. Copy Client ID and Client Secret to Clerk Dashboard

### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Go to Settings → Basic and copy App ID and App Secret
5. Add App Domains and Valid OAuth Redirect URIs:
   - `localhost:3000`
   - `yourdomain.com`
6. Copy App ID and App Secret to Clerk Dashboard

---

## Clerk Dashboard Configuration

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to **Settings → Social Providers**
4. Enable Google and Facebook
5. Paste the credentials from your OAuth provider setup
6. Configure **Redirect URLs** for your frontend

---

## Database Models

### ClerkUser Schema
```javascript
{
  clerkId: String,        // Unique Clerk user ID
  email: String,
  username: String,       // Optional
  name: String,
  avatar: String,         // URL from provider
  provider: String,       // "email", "google", "facebook", etc.
  phone: String,
  address: {
    street, city, state, zip, country
  },
  isActive: Boolean,
  role: String,           // "admin", "vendor", "customer"
  metadata: {
    lastLogin: Date,
    loginCount: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### OAuth Callback
```bash
curl -X POST http://localhost:5000/api/auth/oauth-callback \
  -H "Content-Type: application/json" \
  -d '{ "clerkUserId": "user_xxx" }'
```

---

## Environment Variables

Make sure your `.env` file includes:
```
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
```

These are already added to your `.env` file.

---

## Troubleshooting

### "Clerk middleware not found"
- Make sure `@clerk/express` is installed: `npm install @clerk/express`

### "Can't find module 'ClerkUser'"
- Ensure `src/models/schemas/ClerkUser.js` exists
- Check that models/index.js exports ClerkUser

### OAuth not working
- Verify OAuth provider credentials in Clerk Dashboard
- Check redirect URLs in OAuth provider settings
- Ensure CORS is enabled in Express

### User not created in DB after OAuth
- The authController automatically creates a DB user on first login
- Check MongoDB connection in `.env`

---

## File Structure

```
Backend/
├── src/
│   ├── middleware/
│   │   └── clerk.js         ← Clerk middleware
│   ├── controllers/
│   │   └── authController.js ← Auth logic
│   ├── routes/
│   │   └── authRoutes.js    ← Auth endpoints
│   ├── models/schemas/
│   │   └── ClerkUser.js     ← Clerk user schema
│   └── app.js               ← Updated with Clerk
├── .env                     ← Has Clerk keys
└── CLERK_SETUP.md           ← This file
```

---

## Next Steps

1. ✅ Backend is configured with Clerk
2. Next: Set up frontend with Clerk components
3. Configure OAuth providers (Google, Facebook)
4. Test end-to-end authentication flow

## Product API

The server now exposes a simple product API under `/api/products`.

* **GET `/api/products`** – list products, accepts optional `?tenantId=…` filter.
* **GET `/api/products/:id`** – fetch a single product by its MongoDB object ID.
* **POST `/api/products`** – create a new product (requires Clerk auth). Supply a JSON body with typical fields: `tenantId`, `name`, `slug` (or derived), `basePrice`, etc. Slug must be unique per tenant; duplicates return 400.
* **PUT `/api/products/:id`** – update an existing product (requires Clerk auth). The request body may include any editable fields; `tenantId` cannot be changed.

Business rules enforced by controllers:

* `tenantId` is required when creating a product. If you have a multi‑tenant setup you should derive it from the authenticated user or pass it explicitly.
* If the `name` is changed and no slug is provided, a slug is generated automatically.
* Attempts to overwrite a slug with one that already exists return a `400` error.
* Routes are protected with `requireClerkAuth` – clients must include a valid Clerk session token.

(Keep this section in sync with `backend/README.md` if one exists.)


5. Deploy to production

Need more help? Check [Clerk Documentation](https://clerk.com/docs)
