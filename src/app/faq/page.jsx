export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">FAQ</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How does adoption work?</h3>
            <p className="text-gray-700 dark:text-gray-300">Browse pets, submit a request, and if approved, schedule a pickup.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Is there an adoption fee?</h3>
            <p className="text-gray-700 dark:text-gray-300">Each pet listing shows the adoption fee set by the owner.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I list a pet for adoption?</h3>
            <p className="text-gray-700 dark:text-gray-300">Yes, create an account and use the Add Pet feature.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
