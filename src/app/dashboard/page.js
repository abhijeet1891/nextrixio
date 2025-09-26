// src/app/(dashboard)/apis/page.js
'use client';

import { useState, useEffect, useCallback } from "react"; 
// Import your components
import ApiCard from "../../components/ApiCard";
import AddApiModal from "../../components/AddApiModal";
// Import your service functions and auth context
import { getApis } from "../../services/db/apiService"; 
import { useAuth } from "../../services/db/authClient"; // FIX: Assume useAuth is a named export

export default function ApisPage() {
  // 1. Core Hooks (must run unconditionally)ww
  // ⬅️ NOTE: The useAuth hook provides both user AND loading state.
  const { user, loading: authLoading } = useAuth(); 
  const [apis, setApis] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Data fetching loading state
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  // --- Data Fetching Function (Stabilized with useCallback) ---
  const fetchApis = useCallback(async () => {
    // If the user object is NOT ready (authLoading is true), we don't proceed.
    // The useEffect below handles waiting for authLoading to finish.
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await getApis(user.id); 
      setApis(data);
    } catch (err) {
      console.error('Failed to fetch APIs:', err);
      setError("Could not load APIs. Please check console for details.");
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Depend on user object

  // --- Initial Load Effect ---
  useEffect(() => {
    // Only run fetchApis if authentication is NOT loading.
    if (!authLoading) {
      fetchApis();
    }
  }, [authLoading, fetchApis]); // Depend on authLoading AND fetchApis
  
  // --- Success Handler ---
  const handleModalSuccess = () => {
    setShowModal(false);
    fetchApis(); // Use the stable fetchApis to refresh the data
  };


  // --- RENDERING STATES (Revised for clarity) ---
  // Wait for both the user session AND the API data to load
  if (authLoading || isLoading) {
    return (
      <div className="p-8 text-gray-900">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p>{authLoading ? 'Authenticating...' : 'Loading API Configurations...'}</p>
      </div>
    );
  }

  // If loading is done, but there is no user, redirect (or show error)
  if (!user) {
     // NOTE: A proper redirect should be handled by Next.js Middleware.
     return (
        <div className="p-8 text-red-600">
            <h1 className="text-3xl font-bold mb-6">Access Denied</h1>
            <p>Please log in to view the dashboard.</p>
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

  // --- Final Render ---
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
          onSuccess={handleModalSuccess} 
        />
      )}
    </div>
  );
}