export default function PetCarePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Pet Care Tips</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">Tips for taking care of your new pet:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Provide fresh water and proper nutrition daily</li>
            <li>Schedule regular vet check-ups</li>
            <li>Keep vaccinations up to date</li>
            <li>Give plenty of exercise and playtime</li>
            <li>Show love and patience as they adjust to their new home</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
