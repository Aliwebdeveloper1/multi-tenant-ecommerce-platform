'use client';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  loginSuccess,
  logout,
  clearError,
} from '@/app/store/slices/authSlice';
import { useState } from 'react';

export function Auth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleLogin = () => {
    if (email && name) {
      dispatch(
        loginSuccess({
          id: Date.now().toString(),
          email,
          name,
        })
      );
      setEmail('');
      setName('');
      setShowForm(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">Authentication</h2>

      {isAuthenticated && user ? (
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm text-gray-600">Logged in as:</p>
          <p className="font-bold text-green-700">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <button
            onClick={handleLogout}
            className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-white font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-gray-600">Not logged in</p>

          {error && (
            <div className="rounded bg-red-50 p-3 text-red-700">
              <p className="text-sm">{error}</p>
              <button
                onClick={() => dispatch(clearError())}
                className="text-xs underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-600 transition"
            >
              Show Login Form
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2"
              />
              <button
                onClick={handleLogin}
                className="rounded-lg bg-green-500 px-4 py-2 text-white font-semibold hover:bg-green-600 transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEmail('');
                  setName('');
                }}
                className="rounded-lg bg-gray-500 px-4 py-2 text-white font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
