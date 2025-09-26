// src/app/(dashboard)/apis/page.js
'use client';

import { useState, useEffect, useCallback } from "react"; // ⬅️ IMPORT useCallback
// Import your components
import ApiCard from "../../components/ApiCard";
import AddApiModal from "../../components/AddApiModal";
// Import your service functions and auth context
import { getApis } from "../../services/db/apiService"; 
import { useAuth } from "../../services/db/authClient" // Assuming this path

export default function ApisPage() {
  const { user } = useAuth();
  const [apis, setApis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  // --- 1. Define handleApiAdded ---
  // We wrap this in useCallback to make the function stable
  const handleApiAdded = useCallback(() => {
    setShowModal(false); // Close the modal
    // Note: fetchApis is defined below, but we will call it later
  }, []); 
  
  // --- 2. Data Fetching Function (Wrapped in useCallback) ---
  // The use of useCallback is CRITICAL here to stabilize fetchApis
  const fetchApis = useCallback(async () => {
    // This is the function fetchApis() depends on to complete its logic.
    // If it's not defined, the linting/build system complains.
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Call the service function to get all APIs for the user
      // Passing user.id is explicit but RLS handles the security
      const data = await getApis(user.id); 
      setApis(data);
    } catch (err) {
      console.error('Failed to fetch APIs:', err);
      setError("Could not load APIs. Please check console for details.");
    } finally {
      setIsLoading(false);
    }
  }, [user]); // ⬅️ Dependency array: Only re-define fetchApis when 'user' changes.

  // --- 3. Initial Load Effect ---
  // Now, the useEffect hook only depends on stable functions/values
  useEffect(() => {
    // If handleApiAdded is called, we need to know what fetchApis is
    handleApiAdded.current = fetchApis;
    fetchApis();
  }, [user, fetchApis]); // ⬅️ FIX: Include fetchApis (the stable function)

  // --- 4. Handle Success/Refresh (Revised Logic) ---
  // Re-define handleApiAdded to use the now stable fetchApis
  // We use useEffect to define the success handler to ensure it has the latest fetchApis logic
  useEffect(() => {
    if (showModal === false) {
      // Logic to refresh the list after the modal closes
      if (handleApiAdded) {
        // This is a common pattern to ensure the inner function has the latest fetchApis
        // We will call the version of fetchApis associated with the latest render cycle
        // Since fetchApis is stable (due to useCallback), this works.
        // The easiest solution is to update the component that uses this handler, 
        // but since you use it here, we will make sure it calls the current fetchApis
        
        // Simpler fix: Define the handler inside the component scope and use the stable fetchApis
        // The definition above (with useCallback) is better.
      }
    }
  }, [showModal, fetchApis]); 
  
  // The final, working handleApiAdded that should be called by the modal
  const handleModalSuccess = () => {
    setShowModal(false);
    fetchApis(); // Use the stable fetchApis to refresh the data
  };


  // --- 5. Rendering States ---
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

  // --- 6. Final Render ---
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
            onDelete={fetchApis} // Pass the stable function directly
          />
        ))}
      </div>
      
      {showModal && (
        <AddApiModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          onSuccess={handleModalSuccess} // Use the finalized success handler
        />
      )}
    </div>
  );
}