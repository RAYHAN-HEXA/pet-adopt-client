export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About Us</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            PetAdopt is a platform dedicated to connecting loving families with pets in need of a home.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Our mission is to make pet adoption easy, transparent, and accessible to everyone. We believe every pet deserves a second chance at happiness.
          </p>
        </div>
      </div>
    </div>
  );
}
