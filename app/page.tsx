
'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import TopNav from './components/TopNav';
import { Zap, Lock, Users, ShoppingCart } from 'lucide-react';

export default function Home() {
  const { user } = useUser();

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to E-Commerce
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A complete multi-vendor e-commerce platform with secure Clerk authentication,
              Redux state management, and Stripe payment processing.
            </p>

            {!user ? (
              <div className="space-x-4">
                <Link
                  href="/sign-in"
                  className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-block rounded-lg border-2 border-blue-600 px-8 py-3 text-blue-600 font-semibold hover:bg-blue-50 transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <Link
                href="/dashboard"
                className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-white font-semibold hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </Link>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Lock className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Secure Auth
              </h3>
              <p className="text-gray-600 text-sm">
                Clerk authentication with email, Google, and Facebook
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <ShoppingCart className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Shopping Cart
              </h3>
              <p className="text-gray-600 text-sm">
                Redux-powered cart with persistent storage
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <Zap className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Fast & Modern
              </h3>
              <p className="text-gray-600 text-sm">
                Built with Next.js 16 and React 19
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <Users className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Multi-Vendor
              </h3>
              <p className="text-gray-600 text-sm">
                Support for multiple vendors and shops
              </p>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-gray-600">
            &copy; {new Date().getFullYear()} E-Commerce. All rights reserved.
          </footer>
        </div>
      </div>
    </>
  );
}
