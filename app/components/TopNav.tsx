'use client';

import { useUser, useClerk, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function TopNav() {
  const { user, isLoaded } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600">E-Commerce</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoaded && user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition"
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard/products"
                  className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition"
                >
                  Products
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition"
                >
                  Orders
                </Link>
                <div className="border-l border-gray-200 pl-4">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonBox: "gap-2",
                        avatarBox: "h-10 w-10",
                      },
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {isLoaded && user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="block text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard/products"
                  className="block text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="block text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <div className="px-3 py-2 border-t border-gray-200 mt-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="block text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="block bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
