'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function EditPetPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    petName: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    image: '',
    healthStatus: 'Healthy',
    vaccinationStatus: true,
    location: '',
    adoptionFee: '',
    description: '',
  });

  useEffect(() => {
    if (id) {
      fetchPetDetails();
    }
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      const response = await api.get(`/pets/${id}`);
      const pet = response.data?.data?.pet;

      // Check if user is the owner
      if (pet.ownerEmail !== user?.email) {
        toast.error('You are not authorized to edit this pet');
        router.push('/dashboard');
        return;
      }

      setFormData({
        petName: pet.petName,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        image: pet.image,
        healthStatus: pet.healthStatus,
        vaccinationStatus: pet.vaccinationStatus === 'Up to date',
        location: pet.location,
        adoptionFee: pet.adoptionFee,
        description: pet.description,
      });
    } catch (error) {
      console.error('Error fetching pet details:', error);
      toast.error('Failed to load pet details');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.put(`/pets/${id}`, {
        ...formData,
        vaccinationStatus: formData.vaccinationStatus ? 'Up to date' : 'N/A',
      });
      toast.success('Pet updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to update pet');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Edit Pet
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pet Name *
            </label>
            <input
              type="text"
              name="petName"
              required
              value={formData.petName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Species *
            </label>
            <select
              name="species"
              required
              value={formData.species}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Hamster">Hamster</option>
              <option value="Fish">Fish</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Breed *
            </label>
            <input
              type="text"
              name="breed"
              required
              value={formData.breed}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Age *
            </label>
            <input
              type="number"
              name="age"
              required
              min="0"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender *
            </label>
            <select
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Health Status *
            </label>
            <select
              name="healthStatus"
              required
              value={formData.healthStatus}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Healthy">Healthy</option>
              <option value="Under Treatment">Under Treatment</option>
              <option value="Special Needs">Special Needs</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adoption Fee ($) *
            </label>
            <input
              type="number"
              name="adoptionFee"
              required
              min="0"
              value={formData.adoptionFee}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image URL *
          </label>
          <input
            type="url"
            name="image"
            required
            value={formData.image}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="vaccinationStatus"
              checked={formData.vaccinationStatus}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Vaccinated
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Updating...' : 'Update Pet'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
