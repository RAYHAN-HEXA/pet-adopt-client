export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Contact Us</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Have questions? Reach out to us and we'll be happy to help.
          </p>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p><strong>Email:</strong> info@petadopt.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Address:</strong> 123 Pet Street, Animal City, AC 12345</p>
          </div>
        </div>
      </div>
    </div>
  );
}
