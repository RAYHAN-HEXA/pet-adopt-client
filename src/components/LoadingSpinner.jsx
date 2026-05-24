'use client';

import { FaPaw } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ fullScreen = false }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <FaPaw className="text-5xl text-blue-600 dark:text-blue-400" />
      </motion.div>
      <p className="text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        {spinner}
      </div>
    );
  }

  return spinner;
}
