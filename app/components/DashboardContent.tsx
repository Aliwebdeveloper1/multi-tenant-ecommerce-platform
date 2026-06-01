'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useBackendAPI } from '@/lib/api';
import { Mail, Phone, MapPin, Calendar, User, Loader } from 'lucide-react';

interface BackendUserData {
  clerkUser: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    createdAt: string;
  };
  dbUser: {
    _id: string;
    clerkId: string;
    email: string;
    name: string;
    provider: string;
    role: string;
    avatar: string;
  };
}

export function DashboardContent() {
  const { user, isLoaded } = useUser();
  const { fetchWithAuth } = useBackendAPI();
  const [backendUser, setBackendUser] = useState<BackendUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await fetchWithAuth('/api/auth/me');
        setBackendUser(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch user data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, user, fetchWithAuth]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please sign in to view your dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user.firstName}!</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clerk User Profile */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              <User className="inline-block h-6 w-6 mr-2 text-blue-600" />
              Your Profile
            </h2>

            <div className="space-y-6">
              {/* Avatar and Name */}
              <div className="flex items-center gap-6">
                {user.imageUrl && (
                  <img
                    src={user.imageUrl}
                    alt={user.firstName || 'User'}
                    className="h-24 w-24 rounded-full border-4 border-blue-100"
                  />
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-600">{user.username}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900 font-medium">
                      {user.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Backend User Data */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Account Info
            </h3>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            ) : backendUser ? (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-600">Provider</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {backendUser.dbUser.provider}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Role</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {backendUser.dbUser.role}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Database ID</p>
                  <p className="font-mono text-xs text-gray-700 break-all">
                    {backendUser.dbUser._id}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Synced from backend ✓
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <p className="text-blue-600 text-sm font-semibold">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <p className="text-green-600 text-sm font-semibold">Total Spent</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">$0.00</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <p className="text-purple-600 text-sm font-semibold">
            Account Status
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">Active</p>
        </div>
      </div>
    </div>
  );
}
