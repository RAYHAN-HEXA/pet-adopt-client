'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaDog,
  FaCalendar,
  FaSyringe,
  FaVenusMars,
  FaWeight,
  FaHeart,
  FaShieldAlt,
  FaCheckCircle,
  FaTimes,
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaClipboardList,
} from 'react-icons/fa';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';

function ProductDetailsContent({ id }) {
  const { user } = useAuth();
  const router = useRouter();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    pickupDate: '',
    message: '',
  });

  useEffect(() => {
    if (id) {
      fetchPetDetails();
    }
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      const response = await api.get(`/pets/${id}`);
      setPet(response.data?.data?.pet || null);
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAdoption = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/adoption-requests', {
        petId: pet._id,
        petName: pet.petName,
        userName: user?.name || '',
        userEmail: user?.email || '',
        pickupDate: formData.pickupDate,
        message: formData.message,
      });

      toast.success('Adoption request submitted successfully!');
      setShowAdoptionForm(false);
      setFormData({ pickupDate: '', message: '' });
      router.push('/my-requests');
    } catch (error) {
      toast.error(error.message || 'Failed to submit adoption request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-md"
        >
          <FaDog className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This pet listing may have been removed or doesn't exist.
          </p>
          <Link
            href="/pets"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Browse All Pets
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/pets"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        >
          <FaArrowLeft className="mr-2" />
          Back to Pets
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Image & Key Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <div className="aspect-w-16 aspect-h-10 lg:aspect-h-9">
                <img
                  src={pet.image}
                  alt={pet.petName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ maxHeight: '500px', minHeight: '350px' }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                    {pet.petName}
                  </h1>
                  <div className="flex items-center space-x-3 text-white/90">
                    <span className="flex items-center">
                      <FaDog className="mr-2" />
                      {pet.species}
                    </span>
                    <span>•</span>
                    <span>{pet.breed}</span>
                    <span>•</span>
                    <span>{pet.age}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {pet.adopted ? (
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg flex items-center">
                      <FaCheckCircle className="mr-2" />
                      Adopted
                    </span>
                  ) : (
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg flex items-center">
                      <FaHeart className="mr-2" />
                      Available
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About {pet.petName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {pet.description}
              </p>
            </div>

            {/* Adoption Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Adoption Process
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaClipboardList className="text-2xl text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Submit Request</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fill out the adoption request form with your details
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaUser className="text-2xl text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Owner Review</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The current owner will review your application
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaCheckCircle className="text-2xl text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Meet & Adopt</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Meet the pet and complete the adoption
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Details & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Quick Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <FaDog className="mr-2 text-blue-600 dark:text-blue-400" />
                    Species
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {pet.species}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <FaVenusMars className="mr-2 text-pink-500" />
                    Gender
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {pet.gender}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <FaCalendar className="mr-2 text-orange-500" />
                    Age
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {pet.age}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <FaWeight className="mr-2 text-green-500" />
                    Breed
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {pet.breed}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    Location
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {pet.location}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <FaShieldAlt className="mr-2 text-purple-500" />
                    Health
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    pet.healthStatus === 'Healthy'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {pet.healthStatus}
                  </span>
                </div>
                {pet.vaccinationStatus && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <FaSyringe className="mr-2 text-blue-500" />
                      Vaccinated
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      Yes
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Adoption Fee
              </h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                  ${pet.adoptionFee}
                </span>
                <span className="text-gray-500 dark:text-gray-400">one-time</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Includes initial veterinary checkup and vaccinations
              </p>
            </div>

            {/* Owner Info */}
            {pet.ownerEmail && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Listed By
                </h3>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Pet Owner
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <FaEnvelope className="mr-1" />
                      {pet.ownerEmail}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button / Adoption Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              {!showAdoptionForm ? (
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      if (pet.ownerEmail === user?.email) {
                        toast.error('You cannot adopt your own pet');
                        return;
                      }
                      setShowAdoptionForm(true);
                    }}
                    disabled={pet.adopted}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center ${
                      pet.adopted
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {pet.adopted ? (
                      <>
                        <FaCheckCircle className="mr-2" />
                        Already Adopted
                      </>
                    ) : (
                      <>
                        <FaHeart className="mr-2" />
                        Adopt {pet.petName}
                      </>
                    )}
                  </button>
                  {!pet.adopted && !(pet.ownerEmail === user?.email) && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      You'll be able to set a pickup date and send a message
                    </p>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Adoption Request
                    </h3>
                    <button
                      onClick={() => setShowAdoptionForm(false)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitAdoption} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pet Name
                      </label>
                      <input
                        type="text"
                        value={pet.petName}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Pickup Date
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.pickupDate}
                          onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Species
                        </label>
                        <input
                          type="text"
                          value={pet.species}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed capitalize"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows="4"
                        placeholder="Tell the owner why you'd be a great home for this pet..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      {submitting ? (
                        'Submitting...'
                      ) : (
                        <>
                          <FaCheckCircle className="mr-2" />
                          Submit Request
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  return (
    <PrivateRoute>
      <ProductDetailsContent id={id} />
    </PrivateRoute>
  );
}
