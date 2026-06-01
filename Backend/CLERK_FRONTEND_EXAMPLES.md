/**
 * CLERK AUTHENTICATION - NEXT.JS FRONTEND EXAMPLES
 * 
 * These examples show how to integrate Clerk Auth with the Express backend
 */

// ============================================
// 1. LAYOUT WITH CLERK PROVIDER
// ============================================
// app/layout.tsx

import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata = {
  title: 'E-Commerce',
  description: 'Multi-vendor e-commerce with Clerk Auth',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}

// ============================================
// 2. SIGN-IN PAGE
// ============================================
// app/sign-in/page.tsx

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'bg-white rounded-lg shadow-lg',
          },
        }}
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
}

// ============================================
// 3. SIGN-UP PAGE
// ============================================
// app/sign-up/page.tsx

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'bg-white rounded-lg shadow-lg',
          },
        }}
        signInUrl="/sign-in"
        afterSignUpUrl="/onboarding"
      />
    </div>
  );
}

// ============================================
// 4. USER PROFILE COMPONENT
// ============================================
// app/components/UserProfile.tsx

'use client';

import { useUser } from '@clerk/nextjs';

export function UserProfile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return <div className="p-4">Not authenticated</div>;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-4">
        {user.imageUrl && (
          <img
            src={user.imageUrl}
            alt={user.firstName || 'User'}
            className="h-16 w-16 rounded-full"
          />
        )}
        <div>
          <h2 className="text-xl font-bold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-600">
            {user.emailAddresses[0]?.emailAddress}
          </p>
          <p className="text-sm text-gray-500">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 5. BACKEND API CLIENT HOOK
// ============================================
// lib/api.ts

import { useAuth } from '@clerk/nextjs';

export function useBackendAPI() {
  const { getToken } = useAuth();

  const fetchWithAuth = async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    const token = await getToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${endpoint}`,
      {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
          ...options.headers,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  };

  return { fetchWithAuth };
}

// ============================================
// 6. GET CURRENT USER FROM BACKEND
// ============================================
// app/components/FetchUserData.tsx

'use client';

import { useEffect, useState } from 'react';
import { useBackendAPI } from '@/lib/api';

interface UserData {
  clerkUser: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
  dbUser: {
    _id: string;
    clerkId: string;
    email: string;
    name: string;
    provider: string;
  };
}

export function FetchUserData() {
  const { fetchWithAuth } = useBackendAPI();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWithAuth('/api/auth/me');
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchWithAuth]);

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-xl font-bold">Backend User Data</h2>
      <p className="text-gray-600">Provider: {userData?.dbUser.provider}</p>
      <p className="text-gray-600">Role: {userData?.dbUser.role || 'customer'}</p>
    </div>
  );
}

// ============================================
// 7. SIGN-OUT BUTTON
// ============================================
// app/components/SignOutButton.tsx

'use client';

import { useClerk } from '@clerk/nextjs';

export function SignOutButton() {
  const { signOut } = useClerk();

  return (
    <button
      onClick={() => signOut({ redirectUrl: '/sign-in' })}
      className="rounded-lg bg-red-500 px-4 py-2 text-white font-semibold hover:bg-red-600 transition"
    >
      Sign Out
    </button>
  );
}

// ============================================
// 8. DASHBOARD PAGE (PROTECTED)
// ============================================
// app/dashboard/page.tsx

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserProfile } from '@/components/UserProfile';
import { FetchUserData } from '@/components/FetchUserData';
import { SignOutButton } from '@/components/SignOutButton';

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <SignOutButton />
        </div>

        <UserProfile />
        <FetchUserData />
      </div>
    </div>
  );
}

// ============================================
// 9. HOME PAGE WITH AUTH CHECK
// ============================================
// app/page.tsx

import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export default function HomePage() {
  const { userId } = auth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900">
          E-Commerce Platform
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Powered by Clerk Authentication
        </p>

        <div className="mt-8 space-y-4">
          {userId ? (
            <>
              <Link
                href="/dashboard"
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
              <p className="text-gray-600">
                You are signed in as user ID: {userId}
              </p>
            </>
          ) : (
            <>
              <div className="space-x-4">
                <Link
                  href="/sign-in"
                  className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-block rounded-lg border-2 border-blue-600 px-6 py-3 text-blue-600 font-semibold hover:bg-blue-50"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="font-bold text-gray-900">📧 Email Sign-In</h3>
            <p className="text-gray-600">Traditional email & password</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="font-bold text-gray-900">🔵 Google OAuth</h3>
            <p className="text-gray-600">Sign in with Google</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="font-bold text-gray-900">📱 Facebook OAuth</h3>
            <p className="text-gray-600">Sign in with Facebook</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 10. ENVIRONMENT VARIABLES (.env.local)
// ============================================
// .env.local

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
NEXT_PUBLIC_API_URL=http://localhost:5000

// ============================================
// 11. LAYOUT.TSX WITH AUTH PROTECTION
// ============================================
// app/dashboard/layout.tsx

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
