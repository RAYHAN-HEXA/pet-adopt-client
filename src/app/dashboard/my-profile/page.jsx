'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPen, FaArrowLeft } from 'react-icons/fa';
import { useSpring, animated } from 'react-spring';
import LoadingSpinner from '@/components/LoadingSpinner';
import PrivateRoute from '@/components/PrivateRoute';
import toast from 'react-hot-toast';

function MyProfileContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const springProps = useSpring({
    opacity: loading ? 0.5 : 1,
    transform: loading ? 'scale(0.95)' : 'scale(1)',
    config: { duration: 500 },
  });

  const avatarSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { duration: 600 },
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">My Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your account information and preferences
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <FaArrowLeft /> Back
          </motion.button>
        </motion.div>

        {/* Profile Card */}
        <animated.div style={springProps}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Avatar Section */}
              <animated.div style={avatarSpring} className="flex-shrink-0">
                <div className="relative">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-4 border-blue-500 shadow-lg">
                      <FaUser className="text-5xl text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 shadow-lg">
                    <FaPen className="text-white text-lg" />
                  </div>
                </div>
              </animated.div>

              {/* Profile Info */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Full Name
                    </label>
                    <div className="flex items-center gap-3">
                      <FaUser className="text-blue-600 dark:text-blue-400" />
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">
                        {user.name || 'Not set'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-blue-600 dark:text-blue-400" />
                      <p className="text-lg text-gray-900 dark:text-white">
                        {user.email || 'Not set'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Member Since
                    </label>
                    <p className="text-gray-700 dark:text-gray-300">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'Recently joined'}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/dashboard/edit-profile')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg"
                >
                  <FaPen /> Update Information
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    toast('Password change feature coming soon!');
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                >
                  <FaEnvelope /> Change Password
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </animated.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Account Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 text-center"
            >
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">0</p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Pets Listed</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 text-center"
            >
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">0</p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Adoption Requests</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 text-center"
            >
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">0</p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Adopted</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function MyProfilePage() {
  return (
    <PrivateRoute>
      <MyProfileContent />
    </PrivateRoute>
  );
}
