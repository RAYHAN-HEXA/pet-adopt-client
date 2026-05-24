'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPaw, FaHome } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="inline-block mb-8"
        >
          <FaPaw className="text-8xl text-blue-600 dark:text-blue-400" />
        </motion.div>

        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off. Let's get you back home.
        </p>

        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
        >
          <FaHome />
          <span>Back to Home</span>
        </Link>

        <div className="mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Looking for pets?{' '}
            <Link href="/pets" className="text-blue-600 dark:text-blue-400 hover:underline">
              Browse our available pets
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
