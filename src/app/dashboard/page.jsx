'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaEye, FaClipboardList, FaPaw, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function MyListingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    fetchMyPets();
  }, []);

  const fetchMyPets = async () => {
    try {
      const response = await api.get('/pets/my-listings');
      setPets(response.data?.data?.pets || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
      toast.error('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async (petId) => {
    setLoadingRequests(true);
    try {
      const response = await api.get(`/adoption-requests/pet/${petId}`);
      setRequests(response.data?.data?.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleViewRequests = (pet) => {
    setSelectedPet(pet);
    setShowRequestsModal(true);
    fetchRequests(pet._id);
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await api.patch(`/adoption-requests/${requestId}/approve`);
      toast.success('Request approved successfully!');
      fetchRequests(selectedPet._id);
      fetchMyPets();
    } catch (error) {
      toast.error(error.message || 'Failed to approve request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await api.patch(`/adoption-requests/${requestId}/reject`);
      toast.success('Request rejected');
      fetchRequests(selectedPet._id);
    } catch (error) {
      toast.error(error.message || 'Failed to reject request');
    }
  };

  const handleDeletePet = async (petId) => {
    if (!confirm('Are you sure you want to delete this pet listing?')) {
      return;
    }

    try {
      await api.delete(`/pets/${petId}`);
      toast.success('Pet listing deleted successfully');
      fetchMyPets();
    } catch (error) {
      toast.error(error.message || 'Failed to delete pet');
    }
  };

  const stats = {
    total: pets.length,
    available: pets.filter(p => !p.adopted).length,
    adopted: pets.filter(p => p.adopted).length,
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Listings</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <FaPaw className="text-4xl text-blue-600 dark:text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.available}</p>
            </div>
            <FaClipboardList className="text-4xl text-green-600 dark:text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Adopted</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.adopted}</p>
            </div>
            <FaCheckCircle className="text-4xl text-purple-600 dark:text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* Pets List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Pet Listings</h2>
        </div>

        {pets.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't listed any pets yet</p>
            <button
              onClick={() => router.push('/dashboard/add-pet')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Pet
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {pets.map((pet) => (
              <motion.div
                key={pet._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={pet.image}
                      alt={pet.petName}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {pet.petName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {pet.species} • {pet.breed} • ${pet.adoptionFee}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        pet.adopted
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {pet.adopted ? 'Adopted' : 'Available'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewRequests(pet)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    >
                      <FaClipboardList />
                      <span>Requests</span>
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/edit-pet/${pet._id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => router.push(`/product/${pet._id}`)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <FaEye />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDeletePet(pet._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Requests Modal */}
      {showRequestsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Adoption Requests for {selectedPet?.petName}
              </h3>
              <button
                onClick={() => setShowRequestsModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loadingRequests ? (
                <LoadingSpinner />
              ) : requests.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No adoption requests yet
                </p>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request._id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {request.userName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {request.userEmail}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status === 'approved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : request.status === 'rejected'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {request.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Pickup Date:</strong> {new Date(request.pickupDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <strong>Message:</strong> {request.message}
                      </p>

                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveRequest(request._id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
