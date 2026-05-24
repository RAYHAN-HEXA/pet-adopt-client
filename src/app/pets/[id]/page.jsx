'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaHeart, FaDog, FaCalendar, FaSyringe, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function PetDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
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
      console.error('Error fetching pet details:', error);
      toast.error('Failed to load pet details');
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptClick = () => {
    if (!user) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', `/pets/${id}`);
      }
      router.push('/login');
      return;
    }

    // Check if user is the pet owner
    if (pet.ownerEmail === user.email) {
      toast.error('You cannot adopt your own pet');
      return;
    }

    if (pet.adopted) {
      toast.error('This pet has already been adopted');
      return;
    }

    setShowAdoptionForm(true);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Pet not found</p>
          <button
            onClick={() => router.push('/pets')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to All Pets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pet Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="relative h-96 lg:h-full rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={pet.image}
                alt={pet.petName}
                className="w-full h-full object-cover"
              />
              {pet.adopted && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
                  Adopted
                </div>
              )}
              {!pet.adopted && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full font-semibold">
                  Available
                </div>
              )}
            </div>
          </motion.div>

          {/* Pet Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {pet.petName}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <FaDog className="mr-2 text-blue-600" />
                  {pet.species}
                </span>
                <span>•</span>
                <span>{pet.breed}</span>
                <span>•</span>
                <span>{pet.age}</span>
              </div>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FaMapMarkerAlt className="mr-2 text-blue-600" />
              <span>{pet.location}</span>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`px-4 py-2 rounded-full font-semibold ${
                pet.healthStatus === 'Healthy'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {pet.healthStatus}
              </span>
              {pet.vaccinationStatus && (
                <span className="px-4 py-2 rounded-full font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 flex items-center">
                  <FaSyringe className="mr-2" />
                  Vaccinated
                </span>
              )}
              <span className="px-4 py-2 rounded-full font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {pet.gender}
              </span>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About {pet.petName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {pet.description}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Adoption Fee
              </h3>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                ${pet.adoptionFee}
              </p>
            </div>

            {!showAdoptionForm ? (
              <button
                onClick={handleAdoptClick}
                disabled={pet.adopted}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
                  pet.adopted
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {pet.adopted ? 'Already Adopted' : 'Adopt Me'}
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Adoption Request
                  </h3>
                  <button
                    onClick={() => setShowAdoptionForm(false)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                <form onSubmit={handleSubmitAdoption} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pet Name
                    </label>
                    <input
                      type="text"
                      value={pet.petName}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
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
                      placeholder="Tell us why you want to adopt this pet..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Adoption Request'}
                  </button>
                </form>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
