// src/components/AddApiModal.js - FIXED CODE

'use client';
import { useState } from "react";
import { addApi } from "../services/db/apiService"; // Corrected relative import
import { useAuth } from "../services/db/authClient"; // Corrected relative import

export default function AddApiModal({ isOpen, onClose, onSuccess }) {
  
  // FIX: All Hooks must be called unconditionally at the top level.
  const { user } = useAuth(); // Hook 1
  const [name, setName] = useState(""); // Hook 2
  const [url, setUrl] = useState(""); // Hook 3
  const [method, setMethod] = useState("GET"); // Hook 4
  const [alertMs, setAlertMs] = useState(5000); // Hook 5
  const [isLoading, setIsLoading] = useState(false); // Hook 6
  const [error, setError] = useState(null); // Hook 7

  // Now, place the conditional logic after all hooks are called.
  if (!isOpen) return null; 

  const handleSubmit = async (e) => {
    // ... rest of the handleSubmit logic (no changes needed here)
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("User session expired. Please log in.");
      return;
    }
    if (!name || !url) {
      setError("API Name and URL are required.");
      return;
    }

    setIsLoading(true);

    const newApiData = {
      "userId": user.id, 
      name,
      url,
      method,
      "alertMs": alertMs,
    };

    try {
      await addApi(newApiData); 
      onSuccess(); 
    } catch (err) {
      console.error('API creation failed:', err);
      setError(`Error adding API: ${err.message || "Network error."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... rest of the JSX (no changes needed here)
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md text-gray-900">
        <h2 className="text-xl font-bold mb-4">Add New API Endpoint</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          {/* 1. API Name */}
          <input
            type="text"
            placeholder="API Name (e.g., Payment Gateway)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full mb-3 rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {/* 2. API URL */}
          <input
            type="url"
            placeholder="Endpoint URL (e.g., https://api.example.com/health)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 w-full mb-3 rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
          
          <div className="flex space-x-3 mb-4">
            {/* 3. HTTP Method */}
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="border p-2 w-1/3 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
            
            {/* 4. Alert Threshold */}
            <div className="flex-1">
              <input
                type="number"
                placeholder="Alert ms"
                title="Response time threshold in milliseconds to trigger an alert."
                value={alertMs}
                onChange={(e) => setAlertMs(parseInt(e.target.value))}
                className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                min="100" // Minimum practical latency
              />
              <small className="text-gray-500">Alert if latency  {alertMs}ms</small>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition disabled:bg-blue-400"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Add API'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}