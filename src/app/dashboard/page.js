// src/app/(dashboard)/apis/page.js
'use client';

import { useState, useEffect, useCallback } from "react"; 
// Import your components
import ApiCard from "../../components/ApiCard";
import AddApiModal from "../../components/AddApiModal";
// Import your service functions and auth context
import { getApis } from "../../services/db/apiService"; 
// FIX: Assume useAuth is a named export (most common for hooks)
import { useAuth } from "../../services/db/authClient";

export default function ApisPage() {
  // 1. Core Hooks (must run unconditionally)
  const { user } = useAuth();
  const [apis, setApis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  // --- Data Fetching Function (Stabilized with useCallback) ---
  const fetchApis = useCallback(async () => {
    // We intentionally ignore fetch if user is not present, 
    // but we still need to set loading state correctly.
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
  }, [user]); // Only needs to re-define when 'user' changes.

  // --- Initial Load Effect ---
  useEffect(() => {
    // Runs when the component mounts and whenever 'user' or 'fetchApis' changes
    fetchApis();
  }, [user, fetchApis]); 
  // NOTE: The previous dependency warning is resolved by including fetchApis (stabilized by useCallback).
  
  // --- Success Handler ---
  const handleModalSuccess = () => {
    setShowModal(false);
    fetchApis(); // Use the stable fetchApis to refresh the data
  };


  // --- RENDERING STATES ---
  // We avoid rendering the dashboard content until we have a user state
  if (isLoading && !user) {
    return (
      <div className="p-8 text-gray-900">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p>Authenticating user...</p>
      </div>
    );
  }

  // Once user is loaded, if data is loading, show loading, otherwise continue.
  if (isLoading) {
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