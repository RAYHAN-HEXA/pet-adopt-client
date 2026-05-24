export default function AdoptionGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Adoption Guide</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Adopting a pet is a rewarding experience. Here's what you need to know:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Browse available pets and find your perfect match</li>
            <li>Submit an adoption request with your details</li>
            <li>Wait for the pet owner to approve your request</li>
            <li>Schedule a pickup date and welcome your new friend home</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
