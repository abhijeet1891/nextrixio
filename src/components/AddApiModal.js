// src/components/AddApiModal.js
'use client';
import { useState } from "react";
import { addApi } from "../services/db/apiService"; // Import your service function
import { useAuth } from "../services/db/authClient"; // Assuming you use this hook for user context

export default function AddApiModal({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null;

  const { user } = useAuth(); // Get the current authenticated user
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [alertMs, setAlertMs] = useState(5000); // Default 5000ms (5 seconds)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
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
      // Data structure must match your 'apis' table columns
      "userId": user.id, 
      name,
      url,
      method,
      "alertMs": alertMs,
    };

    try {
      // Call the service function to insert the new API
      await addApi(newApiData); 
      // If successful, call the parent success handler to close modal and refresh list
      onSuccess(); 
    } catch (err) {
      console.error('API creation failed:', err);
      setError(`Error adding API: ${err.message || "Network error."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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