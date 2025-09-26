// src/components/ApiCard.js
'use client';

import Link from 'next/link';
import { deleteApi } from '../services/db/apiService'; // Import the delete function

// Helper function to process the nested apiMetrics data
const getLatestStatus = (metrics) => {
  if (!metrics || metrics.length === 0) {
    // Default state if no checks have been run yet
    return { status: 'UNKNOWN', time: 'N/A', latency: 'N/A', color: 'bg-gray-500' };
  }
  
  // Sort by checkedAt (most recent first) and get the first one
  const latest = metrics.sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))[0];
  
  let statusText = 'DOWN';
  let color = 'bg-red-500';

  if (latest.status === 'UP') {
    statusText = 'UP';
    color = 'bg-green-500';
  } else if (latest.status === 'DOWN' && latest.responseTime > 0) {
    statusText = 'SLOW/FAIL';
    color = 'bg-yellow-500';
  }
  
  return { 
    status: statusText, 
    time: new Date(latest.checkedAt).toLocaleString(), 
    latency: `${latest.responseTime}ms`,
    color: color 
  };
};


// Note: The component now expects 'api' (the full object) and 'onDelete' (from parent)
export default function ApiCard({ api, onDelete }) {
  const { status, time, latency, color } = getLatestStatus(api.apiMetrics);
  
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the API: ${api.name}? This cannot be undone.`)) {
      try {
        await deleteApi(api.id); // Call the service function
        onDelete(); // Trigger parent page refresh (fetchApis)
      } catch (err) {
        console.error('Deletion failed:', err);
        alert('Failed to delete API. Check console.');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-8 transition hover:shadow-xl" style={{borderColor: color.replace('bg-', 'var(--')}}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold truncate">
          {api.name}
        </h3>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${color}`}>
          {status}
        </span>
      </div>

      <p className="text-gray-600 truncate mb-2">
        {api.url}
      </p>

      <div className="mb-4 text-sm text-gray-500">
        <p>Method: <span className="font-medium text-gray-800">{api.method}</span></p>
        <p>Latency: <span className="font-medium text-gray-800">{latency}</span></p>
        <p>Last Check: <span className="font-medium text-gray-800">{time}</span></p>
      </div>

      <div className="flex justify-between space-x-2 mt-4 pt-4 border-t border-gray-100">
        {/* Link to the detailed metrics page using the dynamic ID */}
        <Link 
          href={`/dashboard/apis/${api.id}`} 
          className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 rounded transition duration-150"
        >
          View Metrics
        </Link>
        <button 
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded transition duration-150"
        >
          Delete
        </button>
      </div>
    </div>
  );
}