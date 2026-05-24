'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaImage, FaArrowLeft, FaSave } from 'react-icons/fa';
import { useSpring, animated, config } from 'react-spring';
import LoadingSpinner from '@/components/LoadingSpinner';
import PrivateRoute from '@/components/PrivateRoute';
import toast from 'react-hot-toast';

function EditProfileContent() {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        image: user.image || '',
      });
      setPreviewImage(user.image || '');
    }
  }, [user]);

  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.gentle,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Update preview image if it's the image field
    if (name === 'image') {
      setPreviewImage(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      await updateProfile({
        name: formData.name,
        image: formData.image,
      });
      toast.success('Profile updated successfully!');
      router.push('/dashboard/my-profile');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Update Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Edit your account information
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

        {/* Form Card */}
        <animated.div style={springProps}>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="space-y-8">
              {/* Image Preview Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Profile Picture
                </label>
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  {/* Preview */}
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextElementSibling) {
                              e.target.nextElementSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUser className="text-5xl text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Input */}
                  <div className="flex-1">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image URL
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaImage className="text-gray-400" />
                      </div>
                      <input
                        id="image"
                        name="image"
                        type="url"
                        value={formData.image}
                        onChange={handleChange}
                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Upload your image to imgbb.com or postimages.org and paste the URL
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="name" className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors text-lg"
                    placeholder="John Doe"
                  />
                </div>
              </motion.div>

              {/* Info Alert */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-blue-50 dark:bg-gray-700 border border-blue-200 dark:border-gray-600 rounded-lg p-4"
              >
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  💡 <strong>Tip:</strong> You can use imgbb.com or postimages.org to host your profile image for free
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave /> {loading ? 'Updating...' : 'Update Profile'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </motion.button>
              </motion.div>
            </div>
          </motion.form>
        </animated.div>
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <PrivateRoute>
      <EditProfileContent />
    </PrivateRoute>
  );
}
