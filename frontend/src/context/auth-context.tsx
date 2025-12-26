"use client";

import React, { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
// import { api } from '@/lib/api-client'; // Import the axios instance
// import { jwtDecode } from 'jwt-decode'; // Optional: if we want to decode token for user info immediately

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return Cookies.get('token') || null;
    }
    return null;
  });

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const [isLoading] = useState(false); // No longer loading initially as we check sync
  const router = useRouter();

  // Effect to sync state if cookies change externally (optional, but good for multi-tab)
  // For now, we trust the lazy init.

  const login = (newToken: string, newUser: User) => {
    Cookies.set('token', newToken, { expires: 7 }); // 7 days (refresh token usually longer, but access 15m. Simplified for MVP)
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    router.push('/work-orders'); // Default redirect
  };

  const logout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  // Optional: Verify token validity via API on mount?
  // For MVP, if token exists locally we assume logged in until 401.

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
