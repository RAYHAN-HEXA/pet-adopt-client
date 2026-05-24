'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaHeart, FaDog } from 'react-icons/fa';

export default function PetCard({ pet }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={pet.image}
          alt={pet.petName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        {pet.adopted && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Adopted
          </div>
        )}
        {!pet.adopted && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Available
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {pet.petName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {pet.breed} • {pet.age}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FaDog className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {pet.species}
            </span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <FaMapMarkerAlt className="mr-2 text-blue-600 dark:text-blue-400" />
          <span>{pet.location}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${pet.adoptionFee}
          </span>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              pet.healthStatus === 'Healthy' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
              {pet.healthStatus}
            </span>
            {pet.vaccinationStatus && (
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                Vaccinated
              </span>
            )}
          </div>
        </div>

        <Link
          href={`/product/${pet._id}`}
          className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-semibold transition-colors"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
