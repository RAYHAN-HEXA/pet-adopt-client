'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (session?.user) {
        const betterUser = session.user;

        if (session.session?.token) {
          localStorage.setItem('token', session.session.token);
        }

        setUser({
          _id: betterUser.id,
          id: betterUser.id,
          email: betterUser.email,
          name: betterUser.name,
          fullName: betterUser.name,
          role: betterUser.role || 'ADOPTER',
          phoneNumber: betterUser.phoneNumber || null,
          image: betterUser.image || null,
          photoURL: betterUser.image || null,
          emailVerified: betterUser.emailVerified,
          createdAt: betterUser.createdAt,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [session, isPending]);

  const login = async (email, password) => {
    try {
      const result = await authClient.signIn.email({ email, password });

      if (result.error) {
        throw new Error(result.error.message || 'Login failed');
      }

      if (result.data?.session?.token) {
        localStorage.setItem('token', result.data.session.token);
      }

      toast.success('Login successful!');
      return result.data;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const result = await authClient.signUp.email({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        image: userData.photoURL || undefined,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Registration failed');
      }

      toast.success('Registration successful! Please login.');
      return result.data;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const loginWithGoogle = async (idToken) => {
    try {
      const result = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
        idToken,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Google login failed');
      }

      if (result.data?.session?.token) {
        localStorage.setItem('token', result.data.session.token);
      }

      toast.success('Login successful!');
      return result.data;
    } catch (error) {
      toast.error(error.message || 'Google login failed');
      throw error;
    }
  };

  const updateProfile = async (userData) => {
    try {
      const result = await authClient.updateUser({
        name: userData.name,
        image: userData.photoURL || userData.image,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      return result.data;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const checkAuth = useCallback(async () => {
    try {
      const { data: sessionData } = await authClient.getSession();
      if (sessionData?.user) {
        const betterUser = sessionData.user;

        if (sessionData.session?.token) {
          localStorage.setItem('token', sessionData.session.token);
        }

        setUser({
          _id: betterUser.id,
          id: betterUser.id,
          email: betterUser.email,
          name: betterUser.name,
          fullName: betterUser.name,
          role: betterUser.role || 'ADOPTER',
          phoneNumber: betterUser.phoneNumber || null,
          image: betterUser.image || null,
          photoURL: betterUser.image || null,
          emailVerified: betterUser.emailVerified,
          createdAt: betterUser.createdAt,
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    loading: loading || isPending,
    login,
    register,
    loginWithGoogle,
    updateProfile,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
