'use client';

import { useAuth } from '@clerk/nextjs';

export function useBackendAPI() {
  const { getToken } = useAuth();

  const fetchWithAuth = async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    try {
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
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  };

  return { fetchWithAuth };
}
