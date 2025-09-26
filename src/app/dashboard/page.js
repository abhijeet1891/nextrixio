'use client';

import { useState, useEffect } from "react";
// Import your components
import ApiCard from "../../components/ApiCard";
import AddApiModal from "../../components/AddApiModal";
// Import your service functions and auth context
import { getApis } from "../../services/db/apiService"; 
import { useAuth } from "../../services/db/authClient" // Assuming this path or equivalent hook

export default function ApisPage() {
  const { user } = useAuth(); // Get the current authenticated user
  const [apis, setApis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  // --- 1. Data Fetching Function ---
  const fetchApis = async () => {
    if (!user) {
      // User is not yet loaded or not authenticated
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Call the service function to get all APIs for the user
      // RLS ensures only the user's data is returned
      const data = await getApis(user.id); 
      setApis(data);
    } catch (err) {
      console.error('Failed to fetch APIs:', err);
      setError("Could not load APIs. Please check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Initial Load Effect ---
  useEffect(() => {
    fetchApis();
  }, [user]); // Re-fetch when the user object changes (e.g., after login)

  // --- 3. Handle Success/Refresh ---
  // This is called by the AddApiModal after a successful insertion
  const handleApiAdded = () => {
    setShowModal(false); // Close the modal
    fetchApis();         // Refresh the list to show the new API
  };

  // --- 4. Rendering States ---
  if (isLoading || !user) {
    return (
      <div className="p-8 text-gray-900">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p>Loading API Configurations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600">
        <h1 className="text-3xl font-bold mb-6">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  // --- 5. Final Render ---
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
            Monitored APIs ({apis.length})
        </h1>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          + Add API
        </button>
      </div>
      
      {apis.length === 0 && (
        <div className="text-center p-12 border-2 border-dashed rounded-lg text-gray-500">
            <p className="text-xl mb-4">You are not monitoring any APIs yet.</p>
            <button 
              onClick={() => setShowModal(true)} 
              className="text-blue-600 font-semibold hover:text-blue-800"
            >
              Click here to add your first API.
            </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apis.map(api => (
          // Pass onDelete to ApiCard so it can refresh the list after deletion
          <ApiCard 
            key={api.id} 
            api={api} 
            onDelete={fetchApis} 
          />
        ))}
      </div>
      
      {showModal && (
        <AddApiModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          onSuccess={handleApiAdded} 
        />
      )}
    </div>
  );
}